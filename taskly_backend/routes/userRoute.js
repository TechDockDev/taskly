import { Router } from "express";

import {Guest_Login, User_SignIn_Or_SignUp, Dummy_Sign, User_Login, User_Register, forgotPassword} from '../controllers/authController.js';
import { Get_Single_User } from "../controllers/userController.js";
import authToken from "../middleware/authToken.js";

const router = Router();

router.route('/google/sign-in').post(User_SignIn_Or_SignUp);
router.route('/sign-in').post(User_Login)
router.route('/sign-up').post(User_Register)
router.route('/forgot-password').post(forgotPassword)
// router.route('/guest-login').post(Guest_Login);
router.route('/getUser/:userId').get(Get_Single_User);
// router.route('/dummy-sign').post(Dummy_Sign)

export default router;