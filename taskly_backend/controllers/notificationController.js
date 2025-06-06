import Notification from "../models/notificationModel.js";

export const Create_Notification = async (req, res) => {
    const userId = req?.auth?.id;
    const { message } = req.body;
    try {
        const userMessage = await Notification.create({
            userId,
            message
        })
        return res.status(201).json({
            message: "Notification saved successfully",
            success: true,
            userMessage

        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "Internal server error", success: false })
    }
}

export const Get_User_Notifications = async (req, res) => {
    const userId = req?.auth?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    try {
        const notifications = await Notification.find({
            userId,
        }).limit(limit).skip(skip).sort({ createdAt: -1 });
        const totalNotifi = notifications.length;
        return res.status(200).json({
            message: "All Notifications", success: false, notifications, pagination: {
                totalNotifications: totalNotifi,
                currentPage: page,
                totalPages: Math.ceil(totalNotifi / limit),
                limit,
            }
        })
    } catch (error) {
        console.log('Error in get notification:  ', error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const Delete_User_Notification = async (req, res) => {
    const userId = req.auth.id;
    const { notificationId } = req.query;
    try {
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    } catch (error) {
        console.log('Error in Delete Notification:  ', error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}