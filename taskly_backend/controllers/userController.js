import express from 'express';
import firebaseAdmin from '../config/firebase.config.js';
import User from '../models/userModel.js'
import authToken from '../middleware/authToken.js';


export const User_SignIn_Or_SignUp = async (req, res) => {
    const { name, phoneNumber, firebaseToken, isLocationPermission, isNotificationPermission } = req.body;
    if(!name || !phoneNumber)  return res.status(400).json({message:"Please provide all fields"});
    if (!firebaseToken) {
        return res.status(400).json({ error: "Firebase token is required" });
    }
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(firebaseToken);
        const decodedPhoneNumber = decodedToken.phone_number;
        if (!decodedPhoneNumber) {
            return res.status(400).json({ error: "Phone number not found in token" });
        }
        if (decodedPhoneNumber !== phoneNumber) {
            return res.status(403).json({
              success: false,
              message: "Phone number mismatch between token and request body",
            });
        }
        const user = await User.findOne({ phoneNumber });
        console.log("User==>", user);
        if (!user) {
            let newUser = await User.create({
                name: name,
                phoneNumber: phoneNumber,
                isLocationPermission: isLocationPermission,
                isNotificationPermission: isNotificationPermission
            })
            console.log(newUser);
            authToken.userSendToken(newUser, 200, res, "register");
        }else{
            authToken.userSendToken(user, 200, res, "login");
        }
    } catch (error) {
        console.log(error);
    }
}

export const User_Signout = async(req, res) => {
    res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "Successfully Logged Out!" });
}
