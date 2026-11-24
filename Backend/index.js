import express from "express";
import cors from "cors";
import userRouter from "./Routes/UserRoutes.js";
import courseRouter from "./Routes/CourseRoutes.js";
import enrollRouter from "./Routes/EnrollmentRoutes.js";
import paymentRouter from "./Routes/PaymentRoutes.js";

const app = express();

const port = 3000;
app.use(express.json());
app.use(cors());
app.use("/user",userRouter);
app.use("/course",courseRouter);
app.use("/enrollment",enrollRouter);
app.use("/payment",paymentRouter);


app.listen(port,()=>{
    console.log(`Server Running on port: ${port}`)
})