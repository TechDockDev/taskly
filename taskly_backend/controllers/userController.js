import express from 'express';
import firebaseAdmin from '../config/firebase.config.js';
import User from '../models/userModel.js'
import authToken from '../middleware/authToken.js';


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

export const User_Signout = async (req, res) => {
    res
        .status(200)
        .clearCookie("token")
        .json({ success: true, message: "Successfully Logged Out!" });
}
