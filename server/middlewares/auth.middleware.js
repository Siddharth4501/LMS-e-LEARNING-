import jwt from 'jsonwebtoken'
import AppError from '../utils/error.utils';

const isLoggedIn=async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new AppError('Unautheticated,please login again',400))
    }

    const userDetails=await jwt.verify(token,process.env.JWT_SECRET);//gives data that was stored at the time of generation of Json Web Token
    if(!userDetails){
        return next(new AppError('Token can not be verified',400))
    }
    req.user=userDetails;

    next();
}

export {
    isLoggedIn
}