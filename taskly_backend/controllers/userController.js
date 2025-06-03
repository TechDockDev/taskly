import express from 'express';
import User from '../models/userModel.js'
import { v2 as cloudinary } from 'cloudinary'

export const Get_Single_User = async (req, res) => {
    // const userId = req.auth.id;
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "No UserId Provided", success: false })
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No User Found", success: false });
        }
        return res.status(200).json({ message: "User Found", success: true, user });
    } catch (error) {
        console.log('Error In getting User', error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const Delete_User = async (req, res) => {
    const userId = req.auth.id;
    if (!userId) return res.status(404).json({ message: "No valid user find", success: false });
    try {
        const userData = await User.findById(userId);
        if (userData) {
            const deletedUser = User.deleteOne({ _id: userId });
            return res.status(200).json({ message: "User deleted successfully", success: true, deletedUser });;
        }
        return res.status(404).json({ message: "No user found", success: false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const Update_User_Image = async (req, res) => {
    const userId = req?.auth?.id;
    if (!req.file || !req.file.path || !req.file.filename) {
        return res.status(400).json({ error: "No image uploaded" });
    }
    try {
        const userData = await User.findById(userId);
        if (userData?.photo?.public_id) {
            const result = await cloudinary.uploader.destroy(userData.photo.public_id);
            console.log(result);
        }

        const imageUrl = req.file.path;
        const imagePublicId = req.file.filename;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                photo: {
                    url: imageUrl,
                    public_id: imagePublicId,
                },
            },
            { new: true }
        );
        return res.status(200).json({ message: "Photos uploaded successfully", success: true, user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const Update_Username = async (req, res) =>{
    const userId = req.auth.id;
    const {name} = req.body;
    if(!name){
        return res.status(400).json({message:"Provide Valid Name", success:false});
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name
            }, {new:true}
        )
        return res.status(200).json({ message:"Name updated succesfully", success:true,updatedUser });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server Error", success: false});
    }
}