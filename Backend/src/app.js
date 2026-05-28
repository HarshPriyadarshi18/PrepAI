import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authroutes.js";
 
const app=express();
app.use(express.json());
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.status(200).json({message:"Hello World"});
});

app.use("/api/auth",authRoutes);
export default app;