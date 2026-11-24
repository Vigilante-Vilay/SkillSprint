import express from "express";
import prisma from "../Database/db.js";
import authMiddleware from "./authMiddleware.js";
import upload from "../Utils/uploadMiddleware.js";
import cloudinary from "../Utils/cloudinary.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("thumbnail"), async (req, res) => {
    try {
        const { title, description, price } = req.body;

        // Check instructor role
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user || user.role !== "INSTRUCTOR") {
            return res.status(403).json({
                error: "Only instructors can create courses"
            });
        }

        // Check thumbnail
        if (!req.file) {
            return res.status(400).json({
                error: "Course thumbnail is required"
            });
        }

        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "SkillSprint/Courses",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        // Save course in PostgresSQL
        const course = await prisma.course.create({
            data: {
                title,
                description,
                price: Number(price),
                thumbnail: result.secure_url,
                instructorId: user.id
            }
        });

        return res.status(201).json({
            msg: "Course created successfully",
            course
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Course creation failed"
        });
    }
}
);

router.get("/all", async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return res.status(200).json({ courses });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Failed to fetch courses"
        });
    }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);

        const course = await prisma.course.findUnique({
            where: { id }
        });

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            });
        }

        if (course.instructorId !== req.userId) {
            return res.status(403).json({
                error: "You cannot delete someone else's course"
            });
        }

        await prisma.course.delete({
            where: { id }
        });

        return res.status(200).json({
            msg: "Course deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Failed to delete course"
        });
    }
});

export default router;
