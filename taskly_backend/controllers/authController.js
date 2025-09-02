import express from 'express';
import firebaseAdmin from '../config/firebase.config.js';
import User from '../models/userModel.js'
import authToken from '../middleware/authToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import emailVerificationTemplate from '../template/signupOtpMail.js';
import forgotPasswordTemplate from '../template/forgotPasswordMail.js'
import bcrypt from 'bcrypt';
import otpModel from '../models/otpVerificationModel.js'
import predefinedTags from "../config/predefinedTags.js";

export const User_SignIn_Or_SignUp = async (req, res) => {
  try {
    const { idToken, fcmToken, photo, name } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, email, picture } = decodedToken;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        photo: { url: picture || photo || "" },
        tags: predefinedTags.map(tag => ({
          label: tag,
          type: "predefined"
        }))
      });
    } else {
      if (fcmToken) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            fcmToken
          }, { new: true }
        )
      }
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
  const userId = req.auth.id;
  const updateUser = await User.findByIdAndUpdate(
    userId,
    { fcmToken: "" },
    { new: true }
  );
  res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "Successfully Logged Out!" });
};


//Not in use
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


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (req, res) => {
  try {
    const { email, name } = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).json({message:"User already exists", success:false});
    }
    const otp = generateOTP();
    const otpExpiry = Date.now() + 3 * 60 * 1000; // 3 minutes from now

    let user = await otpModel.findOne({ email });

    if (!user) {
      user = await otpModel.create({
        email,
        otp,
        otpExpiry
      });
    } else {
      user.otp = otp;
      user.otpExpiry = new Date(otpExpiry);
      await user.save();
    }

    const userName = name || "User"; 
    const htmlContent = emailVerificationTemplate({ userName, otp });
    const subject = "Pingnear Email Verification OTP";

    await sendEmail({ email, subject, htmlContent });

    return res.status(200).json({ message: "OTP sent successfully", success: true });

  } catch (error) {
    console.error("sendOTP error:", error);
    return res.status(500).json({ message: "Failed to send OTP", success: false });
  }
};


export const verifyOTP = async (req, res) => {
  const {name, email, otp, password } = req.body;
  try {
    if (!name || !email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and password are required", success: false });
    }
    const otpRecord = await otpModel.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
    if (otpRecord.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired", success: false });
    }
    await otpModel.deleteOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({message:"User already exists", success: false});
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      emailVerified: true
    });
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      firebaseUid:userRecord.uid,
      tags: predefinedTags.map(tag => ({
        label: tag,
        type: "predefined"
      }))
    })
    await authToken.userSendToken(user, 200, res, "login");
  } catch (error) {
    console.error("verifyOTP error:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
}
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't Exists", success: false });
    }
    const resetLink = await firebaseAdmin.auth().generatePasswordResetLink(email);
    const htmlContent = forgotPasswordTemplate({ resetLink });
    const subject = "Pingnear Forget Password Link";
    sendEmail({ email, subject, htmlContent });
    res.status(200).json({ message: "Password reset link sent", success: true });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    res.status(500).json({ message: "Failed to send password reset link", error: error.message, success: false });
  }
}