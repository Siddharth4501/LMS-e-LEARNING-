import { Router } from "express";
import { register,login,logout,getProfile } from "../controllers/user.controller.js";
import isLoggeIn from  "../middlewares/auth.middleware.js"

const router=Router()//instance of Router

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);//get is used so thar by directly writing the url we can logout
router.get('/me',isLoggeIn,getProfile);
export default router;