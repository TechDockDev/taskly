import Task from '../models/taskModel.js';

export const Create_New_Task = async(req, res, next) => {
    const {title, status, location, date, ringType, radius} = req.body;
    try {
        const newTask = await Task.create({
            title:title,
            status:status,
            location:location,
            date:date,
            ringType:ringType,
            radius:radius
        })
        newTask.save();
        return res.status(200).json({success:true, message:"Data added successfully"})
    } catch (error) {
        console.log(error);
    }
}

export const Get_Task_By_Id = async(req, res, next) => {
    const {taskId} = req.params;
    try {
        const task = await Task.findById(taskId);
        if(task){
            return res.status(200).send({success:true,task});
        }
    } catch (error) {
        console.log(error.message);
    }
}

export const Get_All_Task = async(req, res, next) => {
    
}