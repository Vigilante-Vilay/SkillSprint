
import express from "express";
import prisma from "../Database/db.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

router.post("/:courseId", authMiddleware, async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ msg: "Invalid course ID" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user || user.role !== "STUDENT") {
            return res.status(403).json({ msg: "Only students can enroll" });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: user.id,
                courseId: courseId
            }
        });

        return res.status(201).json({
            msg: "Enrolled successfully",
            enrollment
        });

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                msg: "Already enrolled in this course"
            });
        }

        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});


router.get("/my-courses", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user || user.role !== "STUDENT") {
            return res.status(403).json({ msg: "Only students can access this" });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                studentId: user.id
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            msg: "Enrolled courses fetched successfully",
            enrollments
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});


router.get("/course/:courseId", authMiddleware, async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ msg: "Invalid course ID" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user || user.role !== "INSTRUCTOR") {
            return res.status(403).json({ msg: "Only instructors can access this" });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        if (course.instructorId !== user.id) {
            return res.status(403).json({
                msg: "You can only view students enrolled in your courses"
            });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                courseId: courseId
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            msg: "Enrolled students fetched successfully",
            enrollments
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

export default router;
