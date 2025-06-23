import {User} from '../models/User.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js';
import { sendverificationEmail,sendWelcomeEmail,sendPasswordResetEmail ,sendResetSuccessEmail} from '../mailtrap/emails.js';

export const signup=async(req,res)=>{
    const {email,password,name}=req.body;

    try{
        if(!email||!password||!name){
            throw new Error("All fields are requires");
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({success:false,message:"user already exists"});
        }
        const hashPassword=await bcryptjs.hash(password,10);
        const verificationToken=Math.floor(100000 + Math.random() * 900000).toString();

        const user=new User({
            email,
            password:hashPassword,
            name,
            verificationToken,
            verificationExpires: Date.now()+24*60*60*1000
        })
        await user.save();


        generateTokenAndSetCookie(res,user._id);


        await sendverificationEmail (user.email,verificationToken);
        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                ...user._doc,
                password: undefined
            },
        });

    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }

};

export const verifyEmail= async(req,res)=>{
    const{code}=req.body;

    try{
        const user=await User.findOne({
            verificationToken:code,
            verificationExpires:{$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired verification code"})
        }

        user.isverified=true;
        user.verificationToken=undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
            success: true,
            message:"email verified successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        })
    }
    catch(error){
        console.log("error in verifyEmail",error)
        res.status(500).json({success:false,message:"Server error"});

    }
}
export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"invalid credentials"});
        }
        const isPasswordValid=await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false,message:"invalid credentials"});
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastLogin=new Date();
        await user.save();

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                ...user._doc,
                password: undefined
            },
        });

    }
    catch(error){
        console.log("Error in login",error);
    res.status(400).json({success:false,message:error.message});
    }
}   
export const logout=async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success:true,message:"logged out successfully"});
}


export const forgotPassword=async(req,res)=>{
    const {email}=req.body;
    try{

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"user not found"});
        }

        const resetToken =crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt=Date.now()+1*60*60*1000;

        user.resetPasswordToken=resetToken;
        user.resetPasswordExpires=resetTokenExpireAt;

        await user.save();

        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
       res.status(200).json({success:true,message:"Password reset link sent to your email"});

    }catch(error){
        console.error(`Error in forgotPassword`,error);
       res.status(400).json({success:false,message:error.message});
    }
}



export const resetPassword=async(req,res)=>{
    try{
        const {token}=req.params;
        const {password}=req.body;
        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpires:{$gt:Date.now()},
        });
        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired reset token"});
        }


        const hashedPassword=await bcryptjs.hash(password,10);

        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpires=undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);
       res.status(200).json({success:true,message:"Password reset successful"});

    }catch(error){
        console.error(`Error in resetpassword`,error);
       res.status(400).json({success:false,message:error.message});
    }
}

export const checkAuth=async (req,res)=>{
    try{
        const user=await User.findById(req.userId).select("-password");
        if(!user){
           return res.status(400).json({success:false,message:"user not found"});
        }
         res.status(200).json({success:true,user});
    }
    catch(error){
        console.error(`Error in checkAuth`,error);
       res.status(400).json({success:false,message:error.message});

    }
}



