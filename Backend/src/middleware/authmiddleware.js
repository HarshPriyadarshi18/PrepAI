import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect=async(req,res,next)=>{
    try{
        // accept token from cookie or Authorization header (Bearer)
        let token = null;
        if (req.cookies && req.cookies.token) token = req.cookies.token;
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!token && authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Not authorized"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        req.user=user;
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message:"invalid token"
        })  ;

    }
}