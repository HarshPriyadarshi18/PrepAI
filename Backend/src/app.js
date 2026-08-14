import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authroutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
 import path from "path";
const app=express();
app.use(express.json());
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET","POST","PUT","DELETE","OPTIONS"]
    }
));

app.use("/api/execute", executeRoutes);
app.use(cookieParser());
app.use("/api/interviews",interviewRoutes);
app.use("/api/resumes",resumeRoutes);
app.use("/api/questions", questionRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({message:"Hello World"});
});
app.use("/uploads",express.static(path.join(path.resolve(), "uploads")));

app.use("/api/auth",authRoutes);
export default app;