import { Router } from "express";
import {
    Create_New_Task, 
    Get_Task_By_Id, 
    Get_All_Task, 
    Delete_One_Task, 
    Update_Task, 
    Task_Stats,
    Upcoming_Task_Priority,
    Check_User_Task_Radius,
    Search_User_Task
} from '../controllers/taskController.js'
import { Create_Notification, Get_User_Notifications } from '../controllers/notificationController.js'
import authToken from "../middleware/authToken.js";

const router = Router();

router.route('/add/task').post(
    authToken.isAuthenticated, 
    Create_New_Task
)
router.route('/getTask/:taskId').get(
    authToken.isAuthenticated, 
    Get_Task_By_Id
)
router.route('/get/all/task').get(
    authToken.isAuthenticated, 
    Get_All_Task
)
router.route('/deleteTask/:taskId').delete(
    authToken.isAuthenticated, 
    Delete_One_Task
)
router.route('/updateTask/:taskId').put(
    authToken.isAuthenticated, 
    Update_Task
)

router.route('/stats').get(
    authToken.isAuthenticated,
    Task_Stats
)

router.route('/priority').get(
    authToken.isAuthenticated,
    Upcoming_Task_Priority
)

router.route('/check-status').post(
    // authToken.isAuthenticated,
    Check_User_Task_Radius
)

router.route('/search').get(
    authToken.isAuthenticated,
    Search_User_Task
)


// ==================== Notification Routes ==================

router.route('/create-notification').post(
    // authToken.isAuthenticated,
    Create_Notification
)

router.route('/get-notifications').get(
    // authToken.isAuthenticated,
    Get_User_Notifications
)

export default router;