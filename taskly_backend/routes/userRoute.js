import { Router } from "express";

import {User_SignIn_Or_SignUp, User_Login, User_Register, forgotPassword, User_Signout} from '../controllers/authController.js';
import { Get_Single_User, Delete_User, Update_User_Image, Update_Username, Remove_Tag_From_User, Add_Tag_To_User, Get_All_Tag_Of_User } from "../controllers/userController.js";
import authToken from "../middleware/authToken.js";
import upload from "../middleware/upload.js";

const router = Router();


// ============================= Auth Routes =========================
router.route('/google/sign-in').post(User_SignIn_Or_SignUp)
router.route('/sign-in').post(User_Login)
router.route('/sign-up').post(User_Register)
router.route('/forgot-password').post(forgotPassword)
router.route('/logout').post(authToken.isAuthenticated, User_Signout)
// ====================================================================


// ============================= User Routes ==========================
router.route('/getUser/:userId').get(
    authToken.isAuthenticated,
    Get_Single_User
);

router.route('/delete-user').delete(
    authToken.isAuthenticated, 
    Delete_User
);

router.route('/update/profile-image').post(
    authToken.isAuthenticated, 
    upload.single("image"), 
    Update_User_Image
)

router.route('/update/name').put(
    authToken.isAuthenticated,
    Update_Username
)

router.route('/add-tag').post(
    authToken.isAuthenticated,
    Add_Tag_To_User
)

router.route('/remove-tag').post(
    authToken.isAuthenticated,
    Remove_Tag_From_User
)

router.route('/get-tag').get(
    authToken.isAuthenticated,
    Get_All_Tag_Of_User
)
// =====================================================================

export default router;