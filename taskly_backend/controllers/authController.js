import express from 'express';
import firebaseAdmin from '../config/firebase.config.js';
import User from '../models/userModel.js'
import authToken from '../middleware/authToken.js';
import { v4 as uuidv4 } from 'uuid';
import guestUserModel from '../models/guestUserModel.js';
import jwt from 'jsonwebtoken'

export const User_SignIn_Or_SignUp = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        photo: picture,
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

export const Dummy_Sign = async (req,res) => {
  const {email, name} = req.body;
  const newUser = await User.create({
    firebaseUid: '1234464',
    email,
    name,
    photo: 'https://unsplash.com',
  })
  return res.status(200).json({message:"Hurrah! New user created", success:true, newUser});
}

export const User_Signout = async (req, res) => {
    res
        .status(200)
        .clearCookie("token")
        .json({ success: true, message: "Successfully Logged Out!" });
};

export const Guest_Login = async (req, res) => {
  try {
    const incomingGuestId = req.body && req.body.incomingGuestId ? req.body.incomingGuestId : undefined;
    let guestUser;
    if (incomingGuestId) {
      guestUser = await guestUserModel.findOne({ guestId: incomingGuestId });
      if (!guestUser) {
        const newGuestId = uuidv4();
        guestUser = await guestUserModel.create({
          guestId: newGuestId,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        });
      }
    } else {
      const newGuestId = uuidv4();
      guestUser = await guestUserModel.create({
        guestId: newGuestId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), 
      });
    }
    const token = jwt.sign(
      { guestId: guestUser.guestId, isGuest: true, id: guestUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Guest login successful',
      user: {
        id: guestUser._id,
        guestId: guestUser.guestId,
        isGuest: true,
      },
      token,
    });
  } catch (err) {
    console.error('Guest login error:', err);
    res.status(500).json({ message: 'Guest login failed' });
  }
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