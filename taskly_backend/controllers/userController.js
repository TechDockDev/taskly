import express from 'express';
import User from '../models/userModel.js'
import Task from '../models/taskModel.js';
import { v2 as cloudinary } from 'cloudinary'
import firebaseAdmin from '../config/firebase.config.js';
import agenda from '../config/agenda.js';
import Notification from '../models/notificationModel.js';
import mongoose from 'mongoose';
export const Get_Single_User = async (req, res) => {
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
    const userId = req?.auth?.id;
    try {
        const user = await User.findById(userId);
        const uid = user?.firebaseUid;
        if (uid) {
            await firebaseAdmin.auth().deleteUser(uid)
                .catch(err => {
                    console.error("Firebase deletion failed:", err.message);
                });
            ;  // Deleting from Firebase
        }
        const [deletedTask, deletedUser, deletedNotifications, cancelledJobs] = await Promise.all([
            Task.deleteMany({ userId: userId }),
            User.deleteOne({ _id: userId }),
            Notification.deleteMany({ userId }),
            await agenda.cancel({ 'data.userId': userId })
        ]);
        return res.status(200).json({ message: "User deleted successfully", success: true, deletedUser, deletedTask, deletedNotifications, cancelledJobs });;
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
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const Delete_User_Image = async (req, res) => {
    const userId = req?.auth?.id;
    try {
        const userData = await User.findById(userId);
        if (userData?.photo?.public_id) {
            const result = await cloudinary.uploader.destroy(userData.photo.public_id);
            console.log(result);
        }
        const updatedUser = await User.findByIdAndUpdate(userId,
            {
                photo: {
                    url: '',
                    public_id: '',
                },
            },
            { new: true }
        )
        return res.status(200).json({ message: "Profile Image Deleted Successfully", success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const Update_Username = async (req, res) => {
    const userId = req?.auth?.id;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Provide Valid Name", success: false });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name
            }, { new: true }
        )
        return res.status(200).json({ message: "Name updated succesfully", success: true, updatedUser });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// export const Add_Tag_To_User = async (req, res) => {
//     const userId = req?.auth?.id;
//     const { tag } = req.body;
//     console.log("Body---->",req.body);
//     if (!userId || !tag) {
//         return res.status(400).json({ message: "userId and tag are required", success: false });
//     }

//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { $addToSet: { tags: tag } },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

//         res.status(200).json({
//             message: "Tag added successfully (if not already present)",
//             tags: updatedUser.tags
//         });
//     } catch (error) {
//         console.error("Error adding tag:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }


export const Add_Tag_To_User = async (req, res) => {
  try {
    const userId = req?.user?.id || req?.auth?.id;
    const { tag } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
    }

    if (!tag || typeof tag !== "string" || !tag.trim()) {
      return res.status(400).json({ success: false, message: "Tag must be a non-empty string" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prepare the tag object
    const newTag = {
      _id: new mongoose.Types.ObjectId(),
      label: tag.trim(),
      type: "custom"
    };

    // Add only if not already present
    if (!user.tags.some(t => t.label.toLowerCase() === newTag.label.toLowerCase())) {
      user.tags.push(newTag);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Custom tag added successfully",
      tags: newTag,
    });
  } catch (error) {
    console.error("Error adding tag:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




// export const Remove_Tag_From_User = async (req, res) => {
//     const userId = req?.auth?.id;
//     const { tag } = req.body;

//     if (!userId || !tag) {
//         return res.status(400).json({ message: "userId and tag are required", success: false });
//     }

//     try {
//         const checkTags = await Task.findOne({ userId, tag });
//         if (checkTags != null) {
//             console.log("Help me! I am here")
//             return res.status(400).json({ message: "Tag is associated with other task", success: false })
//         }
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { $pull: { tags: tag } },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

//         res.status(200).json({
//             message: "Tag removed successfully (if it existed)",
//             success: true,
//             tags: updatedUser.tags
//         });
//     } catch (error) {
//         console.error("Error removing tag:", error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// }

export const Remove_Tag_From_User = async (req, res) => {
  try {
    const userId = req?.auth?.id;
    const { tagId } = req.body;

    if (!userId || !tagId) {
      return res.status(400).json({ success: false, message: "userId and tagId are required" });
    }

    // ✅ Make sure it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      return res.status(400).json({ success: false, message: "Invalid tagId" });
    }

    // ✅ Fetch the user with the tag
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Find the tag inside user's tags array
    const tag = user.tags.id(tagId);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    // ✅ Block predefined tags from being deleted
    if (tag.type !== "custom") {
      return res.status(400).json({
        success: false,
        message: "Predefined tags cannot be deleted",
      });
    }

    // ✅ Check if tag is associated with a task
    const checkTag = await Task.findOne({ userId, "tag._id": tagId });
    if (checkTag) {
      return res.status(400).json({
        success: false,
        message: "Tag is associated with other task",
      });
    }

    // ✅ Remove tag only if it's custom
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { tags: { _id: new mongoose.Types.ObjectId(tagId), type: "custom" } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Custom tag removed successfully",
      tags: updatedUser.tags,
    });
  } catch (error) {
    console.error("Error removing tag:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const Get_All_Tag_Of_User = async (req, res) => {
    const userId = req?.auth?.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No user Found", success: false });
        }
        const tags = user.tags;
        return res.status(200).json({ message: "All Tags", success: true, tags });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}