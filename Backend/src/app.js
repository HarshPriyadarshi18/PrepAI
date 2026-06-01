import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authroutes.js";
 import path from "path";
const app=express();
app.use(express.json());
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
));
app.use(cookieParser());
app.use("/api/resumes",resumeRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({message:"Hello World"});
});
app.use("/uploads",express.static(path.join(path.resolve(), "uploads")));

app.use("/api/auth",authRoutes);
export default app;