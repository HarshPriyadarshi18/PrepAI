import dotenv from 'dotenv';
import app from './app.js';
import mongoose from 'mongoose';
 dotenv.config();
 const PORT= process.env.PORT ||5000;
 mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected to mongodb");
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`);
    });
 }).catch((err)=>{
    console.log(err);
 })
