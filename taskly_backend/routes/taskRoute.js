import { Router } from "express";
import {Create_New_Task, Get_Task_By_Id, Get_All_Task, Delete_One_Task, Update_Task} from '../controllers/taskController.js'
import authToken from "../middleware/authToken.js";

const router = Router();

router.route('/add/task').post(
    // authToken.isAuthenticated, 
    Create_New_Task)
router.route('/getTask/:taskId').get(
    // authToken.isAuthenticated, 
    Get_Task_By_Id)
router.route('/get/all/task').get(
    // authToken.isAuthenticated, 
    Get_All_Task)
router.route('/deleteTask/:taskId').delete(
    // authToken.isAuthenticated, 
    Delete_One_Task)
router.route('/updateTask/:taskId').put(
    // authToken.isAuthenticated, 
    Update_Task)

export default router;