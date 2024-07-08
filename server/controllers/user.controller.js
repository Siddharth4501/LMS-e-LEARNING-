// import { request } from "express";
import AppError from "../utils/error.utils";
import User from "../models/user.model";
import cloudinary from 'cloudinary'
import fs from 'fs/promises';

const cookieOptions={
    maxAge:7*24*60*60*1000,
    httpOnly:true,//client cannot change it
    secure:true,
    
}
const register=async(req,res)=>{
    const {fullName,email,password}=req.body

    if (!fullName || !email || !password){ 
        //return instance of error
        return next(new AppError("All fields are required",400));//next helps us to move forward to some other preocess to be executed without abnormal termnation of application
    }
    const userExist=await User.findOne({email});
    if(userExist){
        return next(new AppError("User Already Exist",400));
    }
    const user=await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        }
    });

    if(!user){
        return next(new AppError('User registration failed,please try again',400));
    }

    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill',
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;

                //remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        }catch(e){
            fs.rm(`uploads/${req.file.filename}`)
            return next(new AppError(error|| 'File not uploaded,please try',400))
        }
    }

    await user.save();
    user.select('-password')
    const token=await user.generateJWTToken();
    res.cookie('token',token,cookieOptions)
    res.status(201).json({
        success:true,
        message:'User registered successfully',
        user,
    })
    
};

const login=async (req,res)=>{
    try{
        const {email,password} =req.body;

        if(!email || !password){
            return next(new AppError("All Fields Are Required",400))
        }

        const user=await User.findOne({email}).select('+password');//because by default it is set not to show the password

        if(!user || !user.comaprePassword(password)){
            return next(new AppError('Email or password does not match',400))
        }
        const token=await user.generateJWTToken();
        user.select('-password')//remove password from the data to be send to frontend
        res.cookie('token',token,cookieOptions);

        res.status(200).json({
            success:true,
            message:'User LoggedIn Successfully',
            user,
        })
    }catch(e){
        return next(new AppError(e.message,500))
    }
};

const logout=(req,res)=>{
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:'User Logged out successfully'
    });
};

const getProfile=async (req,res)=>{
    try{
        const userId=req.user.id;
        const user=await User.findOne({userId})
        res.status(200).json({
            success:true,
            message:'User Details',
            user,
        });
    }catch(e){
        return next(new AppError('Failed to fetch profile details',400))
    }
};

export {
    register,
    login,
    logout,
    getProfile
}