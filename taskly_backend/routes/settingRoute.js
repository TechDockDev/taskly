import express from 'express';
import {Edit_Notification_Preference_Setting} from '../controllers/settingController.js'
import authToken from '../middleware/authToken.js';
const router = express.Router();

router.route('/notification').put(authToken.isAuthenticated, Edit_Notification_Preference_Setting)

export default router;