import express from "express";
import prisma from "../Database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateOtp from "../Utils/generateOtp.js";
import transporter from "../Utils/sendEmail.js";


const router = express.Router();


router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.json({
            error: "User already exists"
        })
    }


    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.pendingUser.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPass,
            otp: hashedOtp,
            role,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }
    })

    // Send OTP
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "SkillSprint Email Verification",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    });

    return res.status(200).json({
        msg: "OTP sent successfully"
    });
})


router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    const pendingUser = await prisma.pendingUser.findUnique({
        where: { email }
    })

    if (!pendingUser) {
        return res.json({
            error: "No pending signup found"
        })
    }

    if (pendingUser.expiresAt.getTime() < Date.now()) {
        return res.json({
            error: "Otp has expired"
        })
    }

    const isMatch = await bcrypt.compare(otp, pendingUser.otp);
    if (!isMatch) {
        return res.json({
            error: "Invalid OTP"
        })
    }

    const [user] = await prisma.$transaction([
        prisma.user.create({
            data: {
                firstName: pendingUser.firstName,
                lastName: pendingUser.lastName,
                email: pendingUser.email,
                password: pendingUser.password,
                role: pendingUser.role
            }
        }),

        prisma.pendingUser.delete({
            where: { email }
        })
    ])

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({
        msg: "Email verified and account created successfully",
        token,
        firstName: user.firstName,
        role: user.role
    });
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return res.status(401).json({
            error: "User not found"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            error: "Wrong Password! Try again"
        })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
        msg: "Login Successful",
        token,
        firstName: user.firstName,
        role: user.role
    });
})


export default router;