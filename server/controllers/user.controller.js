// import { request } from "express";
import AppError from "../utils/error.utils.js";
import User from "../models/user.model.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.utils.js";

const cookieOptions={
    maxAge:7*24*60*60*1000,
    httpOnly:true,//client cannot change it
    secure:true,
    
}
const register=async(req,res,next)=>{
    const {fullName,email,password}=req.body
    console.log('first')

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
    console.log('dui',req.file.path)
    if(req.file)// from multer
        {
        try{
            console.log('uppar')
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill',
            });
            if(result){
                console.log('kyu hai2')
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                console.log('kyu hai')
                //remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        }catch(e){
            fs.rm(`uploads/${req.file.filename}`)
            return next(new AppError(e|| 'File not uploaded,please try',400))
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

const forgetPassword=async (req,res)=>{
    const {email}=req.body;
    if(!email){
        return next(new AppError('email is requuired',400));
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new AppError('email not registered',400));
    }
    const resetToken=await user.generatePasswordResetToken();

    await user.save();
    const resetPasswordURL=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try{
        const subject='Reset Password'
        const message=`You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset Your Password</>\n If above link dose not work then copy paste this link in new tab ${resetPasswordURL}`
        await sendEmail(email,subject,message);
        res.status(200).json({
            success:true,
            message:`Reset Password token has been sent to ${email} successfully`
        })
    }catch(e){
        user.forgetPasswordExpiry=undefined;
        user.forgetPasswordToken=undefined;
        await user.save();
        return next(new AppError(e.message,500));
    }
}

const resetPassword=async(req,res)=>
    {
        // Extracting resetToken from req.params object
        const { resetToken } = req.params;
      
        // Extracting password from req.body object
        const { password } = req.body;
      
        // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
        const forgotPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');
      
        // Check if password is not there then send response saying password is required
        if (!password) {
          return next(new AppError('Password is required', 400));
        }
      
        console.log(forgotPasswordToken);
      
        // Checking if token matches in DB and if it is still valid(Not expired)
        const user = await User.findOne({
          forgotPasswordToken,
          forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
        });
      
        // If not found or expired send the response
        if (!user) {
          return next(
            new AppError('Token is invalid or expired, please try again', 400)
          );
        }
        
        // Update the password if token is valid and not expired
        user.password = password;
      
        // making forgotPassword* valus undefined in the DB
        user.forgetPasswordExpiry = undefined;
        user.forgetPasswordToken = undefined;
      
        // Saving the updated user values
        await user.save();
      
        // Sending the response when everything goes good
        res.status(200).json({
          success: true,
          message: 'Password changed successfully',
        });
}

const changePassword=async(req,res)=>{
    const {oldPassword,newPassword} =req.body;
    const {id}=req.user;//all information of user is kept in req.user as created in auth.middleware.js

    if(!oldPassword || ! newPassword){
        return next(new AppError('All fields are mandatory',400))
    }

    const user= await User.findById(id).select('+password')
    if(!user){
        return next(new AppError('User doesn not exist'),400)
    }

    const isPasswordValid=await user.comaprePassword(oldPassword);

    if(!isPasswordValid){
        return next(new AppError('invalid old password',400))
    }
    user.password=newPassword

    await user.save();
    user.select('-password');//remove password from user object

    res.status(200).json({
        success:true,
        message:'Password changed successfully!'
    })


}
const updateUser = async (req, res, next) => {
    // Destructuring the necessary data from the req object
    const { fullName } = req.body;
    const { id } = req.params;
  
    const user = await User.findById(id);
  
    if (!user) {
      return next(new AppError('Invalid user id or user does not exist'));
    }
  
    if (fullName) {
      user.fullName = fullName;
    }
  
    // Run only if user sends a file
    if (req.file) {
      // Deletes the old image uploaded by the user
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms', // Save files in a folder named lms
          width: 250,
          height: 250,
          gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
          crop: 'fill',
        });
  
        // If success
        if (result) {
          // Set the public_id and secure_url in DB
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
  
          // After successful upload remove the file from local storage
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(error || 'File not uploaded, please try again', 400)
        );
      }
    }
  
    // Save the user object
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'User details updated successfully',
    });
  }
export {
    register,
    login,
    logout,
    getProfile,
    resetPassword,
    forgetPassword,
    changePassword,
    updateUser,

}