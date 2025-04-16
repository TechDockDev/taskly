import { Router } from "express";

import {User_SignIn_Or_SignUp} from '../controllers/userController.js';
import authToken from "../middleware/authToken.js";

const router = Router();

router.route('/').post(User_SignIn_Or_SignUp);

export default router;