import Task from '../models/taskModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import haversine from 'haversine-distance';
import firebaseAdmin from '../config/firebase.config.js';
import { scheduleNotification } from '../utils/scheduler.js';

export const Create_New_Task = async (req, res, next) => {
    const { title, tag, location, date, ringType, notifyType, radius, address } = req.body;
    // const userId = req?.auth?.id;
    const userId = '684171d5d90e045cc871c7d8'
    try {
        if (!title || !tag || !location || !location.latitude || !location.longitude || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        let notifyAt = null;
        if(date && notifyType == 'dueDate' ){
            const due = new Date(date);
            // notifyAt = new Date(due.getTime() - 12 * 60 * 60 * 1000);
            notifyAt = new Date(due.getTime()-1 * 60 * 1000)
            console.log('NotifyTime--->', notifyAt)
        }
        const taskData = {
            title,
            tag,
            location,
            userId,
            dueDateTime: date ? new Date(date) : undefined,
            ringType: ringType || 'once',
            notifyType: notifyType || 'nearby',
            radius: radius || 100,
            address,
            notifyAt
        };
        
        const newTask = await Task.create(taskData);

        scheduleNotification(newTask, userId);
        console.log('Task scheduled successfully');

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            newTask
        });

    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to create task",
            error: error.message
        });
    }
}

export const Get_Task_By_Id = async (req, res, next) => {
    const { taskId } = req.params;
    const userId = req?.auth?.id;
    try {
        const task = await Task.findOne({ _id: taskId, userId: userId });
        if (!task) {
            return res.status(404).json({ success: false, message: "No task found" });
        }
        return res.status(200).json({ message: "One Task", success: true, task })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const Get_All_Task = async (req, res, next) => {
    const userId = req?.auth?.id;
    // const userId = '683e9ffe0f487a7758d1eaad'
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        if (status == 'pending') {
            const tasks = await Task.find({ userId: userId, status: 'pending' })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ success: false, message: "No task Found" });
            }
            const totalTask = await Task.countDocuments({ userId: userId, status: 'pending' });
            return res.status(200).json({
                success: true,
                message: "All Pending Tasks",
                tasks,
                pagination: {
                    totalTask,
                    currentPage: page,
                    totalPages: Math.ceil(totalTask / limit),
                    limit,
                }
            });
        }

        else if (status == 'completed') {
            const tasks = await Task.find({ userId: userId, status: 'completed' })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ success: false, message: "No task Found" });
            }
            const totalTask = await Task.countDocuments({ userId: userId, status: 'completed' });
            return res.status(200).json({
                success: true,
                message: "All Completed Tasks",
                tasks,
                pagination: {
                    totalTask,
                    currentPage: page,
                    totalPages: Math.ceil(totalTask / limit),
                    limit,
                }
            });
        }
        const tasks = await Task.find({ userId: userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No task Found" });
        }
        const totalTask = await Task.countDocuments({ userId: userId });
        return res.status(200).json({
            success: true,
            message: "All Tasks",
            tasks,
            pagination: {
                totalTask,
                currentPage: page,
                totalPages: Math.ceil(totalTask / limit),
                limit,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const Delete_One_Task = async (req, res, next) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findByIdAndDelete(taskId);
        return res.status(200).json({ success: true, message: "Task deleted successfully", task });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

export const Update_Task = async (req, res, next) => {
    const { taskId } = req.params;
    const updates = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            updatedTask,
        });
    } catch (error) {
        console.error('Error updating task:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const Task_Stats = async (req, res, next) => {
    const userId = req.auth.id;
    try {
        const totalTask = await Task.countDocuments({ userId: userId });
        const countCompleted = await Task.countDocuments({ userId: userId, status: "completed" });
        const stats = {
            totalTask,
            completed: countCompleted,
            pending: totalTask - countCompleted
        };
        return res.status(200).json({ message: "All Tasks", success: true, stats });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server Error", success: false });
    }
}

export const Upcoming_Task_Priority = async (req, res, next) => {
    const userId = req?.auth?.id;
    // const userId = '683e9ffe0f487a7758d1eaad'
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    try {
        const tasks = await Task.find({
            userId: userId,
            status: 'pending',
            notifyType: 'dueDate',
            dueDateTime: { $gte: new Date() }
        }).sort({ dueDateTime: 1 }).skip(skip).limit(limit)
        const totalTasks = tasks.length;
        res.status(200).json({
            message: "All prioritized Tasks",
            success: true,
            tasks,
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks
        })
    } catch (error) {
        console.log('Error in Task Priority ', error.message)
    }
}

export const Check_User_Task_Radius = async (req, res, next) => {
    const { latitude, longitude } = req.body;
    // const userId = req?.auth?.id;
    const userId = '684171d5d90e045cc871c7d8';
    const user = await User.findById(userId);
    try {
        const tasks = await Task.find({ userId: userId, status: 'pending', notifyType: 'nearby' });
        for (let task of tasks) {
            const taskCoords = { lat: task.location.latitude, lon: task.location.longitude };
            const userCoords = { lat: latitude, lon: longitude };
            const distance = haversine(userCoords, taskCoords);
            console.log('disatance--->', distance)
            if (distance <= task.radius) {
                const title = 'Task Nearby'
                const messageBody = `You're near the task: ${task.title}`
                const messageId = await firebaseAdmin.messaging().send({
                    token: user.fcmToken,
                    notification: {
                        title: title,
                        body: messageBody,
                    },
                });
                console.log('Message Id--->', messageId);
                console.log(`User is within ${task.title} radius`);
                const notify = await Notification.create({
                    userId,
                    taskId: task._id,
                    title,
                    message:messageBody,
                    messageId
                })
                return res.status(200).json({message:"Notification sent successfully!", success:true, task});
            }
        }
        return res.status(404).json({message:"No task found on current location", success: false});
    } catch (error) {
        console.log('Error in Task Radius', error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const Search_User_Task = async (req, res) => {
    try {
        const userId = req.auth?.id;
        const { query = '', page = 1 } = req.query;
        const limit = 5;
        const skip = (page - 1) * limit;

        const searchRegex = new RegExp(query, 'i');

        const filter = {
            userId,
            $or: [
                { title: searchRegex },
                { tag: searchRegex }
            ]
        };

        const totalTasks = await Task.countDocuments(filter);
        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            message: 'Search results',
            tasks,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks
        });
    } catch (error) {
        console.error('Search task error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
