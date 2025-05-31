import Notification from "../models/notificationModel";

export const Create_Notification = async(req, res) => {
    const userId = req.auth.id;
    const {message} = req.body;
    try {
        const userMessage = await Notification.create({
            userId,
            message
        })
        return res.status(201).json({
            message:"Notification saved successfully",
            success: true,
            userMessage

        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message:"Internal server error", success:false})
    }
}

export const Get_All_Notification = async(req, res) => {
    const userId = req.auth.id;
    try {
        const notifications = await Notification.find({userId: userId});
        return res.status(200).json({message:"All notifications of user", success: true, notifications});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal server error", success:false, error:error.message});
    }
}

