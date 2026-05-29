import express from 'express';
import { login, signup ,getMe,Logout} from '../controllers/authcontroller.js';
import {protect} from "../middleware/authmiddleware.js";

const router=express.Router();
router.post("/login",login);
router.post("/signup",signup);
router.get("/me",protect,getMe);
router.get("/logout",Logout);

export default router;
