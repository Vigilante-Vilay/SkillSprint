import express from "express";
import prisma from "../Database/db.js";
import razorpay from "../Utils/razorpay.js";
import authMiddleware from "./authMiddleware.js";
import { createHmac, timingSafeEqual } from "node:crypto";

const router = express.Router();

// Create Razorpay Order
router.post("/create-order/:courseId", authMiddleware, async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ msg: "Invalid course ID" });
        }

        //Getting the logged-in student
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user || user.role !== "STUDENT") {
            return res.status(403).json({ msg: "Only students can purchase courses" });
        }

        // Fetching the course
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        //Checking existing enrollment
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: user.id,
                    courseId: courseId
                }
            }
        });

        if (existingEnrollment) {
            return res.status(409).json({ msg: "Already enrolled in this course" });
        }

        // Convert rupees into paise
        const amount = Math.round(course.price * 100);

        // Create order on Razorpay
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `${user.id}_${course.id}_${Date.now()}`
        });

        // Save order in database
        const payment = await prisma.payment.create({
            data: {
                studentId: user.id,
                courseId: course.id,
                razorpayOrderId: order.id,
                amount: amount
            }
        });

        return res.status(201).json({
            msg: "Order created successfully",
            keyId: process.env.RAZORPAY_KEY_ID,
            order,
            payment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Unable to create order" });
    }
});


// Verify Payment
router.post("/verify", authMiddleware, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Checking whether all values are provided
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                msg: "Missing payment details"
            });
        }

        // Find the payment record in our database
        const paymentRecord = await prisma.payment.findUnique({
            where: {
                razorpayOrderId: razorpay_order_id
            }
        });

        if (!paymentRecord || paymentRecord.studentId !== req.userId) {
            return res.status(404).json({
                msg: "Payment record not found"
            });
        }

        // Check if payment is already successful
        if (paymentRecord.status === "SUCCESS") {
            return res.status(200).json({
                msg: "Payment already verified"
            });
        }

        // Generate signature using our secret key
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
            .update(body)
            .digest("hex");

        const isValidFormat = /^[a-f0-9]{64}$/i.test(razorpay_signature);

        const isValidSignature = timingSafeEqual(
            Buffer.from(expectedSignature, "hex"),
            Buffer.from(razorpay_signature, "hex")
        );

        if (!isValidFormat || !isValidSignature) {
            return res.status(400).json({ msg: "Invalid payment signature" });
        }

        // Fetch actual payment details from Razorpay
        const razorpayPayment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        // Confirm order, amount, currency and payment status
        if (
            razorpayPayment.order_id !== razorpay_order_id ||
            razorpayPayment.amount !== paymentRecord.amount ||
            razorpayPayment.currency !== "INR" ||
            razorpayPayment.status !== "captured"
        ) {
            return res.status(400).json({
                msg: "Payment is not successfully captured"
            });
        }

        // Update Payment and create Enrollment together
        await prisma.$transaction(async (tx) => {

            // Update payment status
            await tx.payment.update({
                where: {
                    razorpayOrderId: razorpay_order_id
                },
                data: {
                    razorpayPaymentId: razorpay_payment_id,
                    status: "SUCCESS"
                }
            });

            // Create enrollment
            await tx.enrollment.upsert({
                where: {
                    studentId_courseId: {
                        studentId: paymentRecord.studentId,
                        courseId: paymentRecord.courseId
                    }
                },
                update: {},
                create: {
                    studentId: paymentRecord.studentId,
                    courseId: paymentRecord.courseId
                }
            });

        });

        return res.status(200).json({
            msg: "Payment verified and student enrolled successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Payment verification failed"
        });
    }
});


export default router;