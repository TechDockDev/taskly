import { Router } from "express";
import {Create_New_Task, Get_Task_By_Id} from '../controllers/taskController.js'

const router = Router();

router.route('/add/task').post(Create_New_Task)
router.route('/get/task/:taskId').get(Get_Task_By_Id)

export default router;