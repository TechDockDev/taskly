import Task from '../models/taskModel.js';

export const Create_New_Task = async(req, res, next) => {
    const {title, tag, location, date, ringType, notifyType, radius} = req.body;
    const userId = req.auth.id;
    try {
        const newTask = await Task.create({
            userId:userId,
            title:title,
            tag:tag,
            location:location,
            date:date,
            ringType:ringType,
            notifyType:notifyType,
            radius:radius
        })
        return res.status(200).json({success:true, message:"Data added successfully"})
    } catch (error) {
        console.log(error);
    }
}

export const Get_Task_By_Id = async(req, res, next) => {
    const {taskId} = req.params;
    const userId = req.auth.id;
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

export const Get_All_Task = async(req, res, next) => {
    const userId = req.auth.id;
    try {
        const tasks = await Task.find({userId:userId});
        if(!tasks){
            return res.status(404).json({success:false, message:"No task Found"});
        }
        return res.status(200).json({ success:true, message:"All Tasks", tasks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export const Delete_One_Task = async(req, res, next) => {
    const {taskId} = req.params;
    try {
        const task = await Task.findByIdAndDelete(taskId);
        return res.status(200).json({success:true, message:"Task deleted successfully"});
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