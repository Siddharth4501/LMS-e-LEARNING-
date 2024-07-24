import { Router } from "express";
import { register,login,logout,getProfile,resetPassword,changePassword,forgetPassword,updateUser } from "../controllers/user.controller.js";
import {isLoggedIn} from  "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";

const router=Router()//instance of Router

router.post('/register',upload.single("avatar"),register);//signgle file upload
router.post('/login',login);
router.get('/logout',logout);//get is used so thar by directly writing the url we can logout
router.get('/me',isLoggedIn,getProfile);
router.post('/reset',forgetPassword);
router.post('/reset/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassword);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);
export default router;