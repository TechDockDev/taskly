import express from 'express';
import firebaseAdmin from '../config/firebase.config.js';
import User from '../models/userModel.js'
import authToken from '../middleware/authToken.js';
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js';


export const User_SignIn_Or_SignUp = async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log('idtoken----->', idToken);
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    console.log('decodedToken--->', decodedToken);
    const { uid, email, name, picture } = decodedToken;
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        photo: {url: picture || ""},
      });
    }
    await authToken.userSendToken(user, 200, res, "login");
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

export const User_Signout = async (req, res) => {
    res
        .status(200)
        .clearCookie("token")
        .json({ success: true, message: "Successfully Logged Out!" });
};

export const User_Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password"
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const isPasswordCorrect = await user.isMatch(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    authToken.userSendToken(user, 200, res, "login");
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const User_Register = async (req, res) => {
  const {name, email, password} = req.body;
  if(!name || !email || !password){
    return res.status(400).json({message:"Provide all fields", success:false});
  }
  try {
    //check existing user
    const userExist = await User.findOne({email});
    if(userExist){
      return res.status(400).json({message:"User already Exists", success: false});
    }
    const newUser = await User.create({
      name,
      email,
      password
    })
    return res.status(201).json({message:"User created successfully", success: true, newUser});
  } catch (error) {
    
  }
}

export const forgotPassword = async (req, res) => {
  const {email} = req.body;
  if(!email){
    return res.status(400).json({message:"Email is required", success:false});
  }
  const user = await User.findOne({email});
  try {
    
    if(!user){
      return res.status(404).json({message:"User not found", success:false})
    }
    const resetToken = user.generateResetPasswordToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Hello ${user.name},</h3>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message
    });

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to your email"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: "Error sending email",
      error: error.message
    });
  }
}