import express from 'express';
import User from '../models/userModel.js'

export const User_SignIn = async(req, res) => {
    const {name, phoneNumber, isLoactionPermission, isNotificationPermission} = req.body;
    try {
        const phoneNumberExists = await User.findOne({phoneNumber});
        if(phoneNumberExists){
            res.status(200).send({message:"Sign in Successfully"});
        }
        else{
            const newUser = await User.create({
                name:name,
                phoneNumber: phoneNumber,
                isLoactionPermission: isLoactionPermission,
                isNotificationPermission:isNotificationPermission
            })
            await newUser.save();
        }
    } catch (error) {
        console.log(error);
    }
}