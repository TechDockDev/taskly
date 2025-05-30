import { Router } from "express";

import {Guest_Login, User_SignIn_Or_SignUp} from '../controllers/userController.js';
import authToken from "../middleware/authToken.js";

const router = Router();

router.route('/sign-in').post(User_SignIn_Or_SignUp);
router.route('/guest-login').post(Guest_Login);

export default router;