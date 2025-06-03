import Task from '../models/taskModel.js';

export const Create_New_Task = async(req, res, next) => {
    const {title, tag, location, date, ringType, notifyType, radius} = req.body;
    const userId = req?.auth?.id;
    try {
        if (!title || !tag || !location || !location.latitude || !location.longitude) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const taskData = {
            title,
            tag,
            location,
            userId,
            date: date ? new Date(date) : undefined,
            ringType: ringType || 'once',
            notifyType: notifyType || 'nearby',
            radius: radius || 100,
        };

        const newTask = await Task.create(taskData);
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

export const Get_Task_By_Id = async(req, res, next) => {
    const {taskId} = req.params;
    const userId = req?.auth?.id;
    try {
        const task = await Task.findOne({ _id: taskId, userId: userId });
        if(!task){
            return res.status(404).json({success:false, message:"No task found"});
        }
        return res.status(200).json({success:true, task })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export const Get_All_Task = async (req, res, next) => {
    const userId = req?.auth?.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const tasks = await Task.find({ userId: userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); 

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No task Found" });
        }

        return res.status(200).json({
            success: true,
            message: "All Tasks",
            tasks,
            pagination: {
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

export const Delete_One_Task = async(req, res, next) => {
    const {taskId} = req.params;
    try {
        const task = await Task.findByIdAndDelete(taskId);
        return res.status(200).json({success:true, message:"Task deleted successfully", task});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false, message:"Internal server Error"});
    }
}

export const Update_Task = async(req, res, next) => {
    const {taskId} = req.params;
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

export const Task_Stats = async(req, res, next) => {
    const userId = req.auth.id;
    try {
        const totalTask = await Task.countDocuments({ userId: userId });
        const countCompleted = await Task.countDocuments({ userId: userId, status: "completed" });
        const stats = {
            totalTask,
            completed: countCompleted,
            pending: totalTask - countCompleted
        };
        return res.status(200).json({message:"All Tasks", success:true, stats});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal server Error", success:false});
    }
}