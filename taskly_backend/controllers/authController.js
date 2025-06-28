import express from 'express';
import firebaseAdmin from '../config/firebase.config.js';
import User from '../models/userModel.js'
import authToken from '../middleware/authToken.js';
import {sendEmail} from '../utils/sendEmail.js';
import emailVerificationTemplate from '../template/signupOtpMail.js';
import bcrypt from 'bcrypt';

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
      });
    } else {
      if (fcmToken) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            fcmToken
          }, {new:true}
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
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Provide all fields", success: false });
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already Exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    })
    return res.status(201).json({ message: "User created successfully", success: true, newUser });
  } catch (error) {
    console.log('Error in Register User: ', error.message);
    res.status(500).json({message:"Internal server Error", success:false});
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); 

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  user.otp = otp;
  user.otpExpiry = new Date(otpExpiry);
  await user.save();

  console.log("Ottpp=>", otp);
  // Send OTP via email
  const userName = user.name;
  const htmlContent = emailVerificationTemplate({userName, otp})
  console.log("HHHHHHHHHHtlm content-->", htmlContent);
  console.log("Emaill->", email);
  const subject = "subject"
  sendEmail({email, subject, htmlContent});

  res.json({ message: "OTP sent successfully" });
};

// verify otp logic
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP",  success: false });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired", success: false });

    return res.status(200).json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message:"Internal Server Error", success: false, error});
  }
  
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required", success: false });
  }
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false })
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