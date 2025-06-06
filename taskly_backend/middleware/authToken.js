import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const authToken = {
    //Token Generation
    signToken: function (id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    },

    // ======|USER: COOKIE SETUP AND RESPONSE RETURN |=========
    userSendToken: async function (userAuth, statusCode, res, ops) {
        const token = this.signToken(userAuth._id)
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure:false,
            sameSite: 'Lax'
        }
        res.cookie('token', token, options);
        let message;
        if (ops.toLowerCase() === 'login') {
            message = 'You are logged in successfully.'
        }
        else if (ops.toLowerCase() === 'register') {
            message = 'User registered Successfully!'
        }
        else if (ops.toLowerCase() === 'reset') {
            message = 'Password reset successful'
        }
        return res.status(statusCode).json({
            success: true,
            status: "success",
            message,
            token,
            user: userAuth
        })

    },

    // =======|CHECK FOR AUTHENTICATED USER |==========
    isAuthenticated: async function (req, res, next) {

        let token = req.cookies?.token || '';
        const authHeader = req.headers['authorization'];
        const tokenFromHeader = authHeader && authHeader.split(' ')[1];
        token = token || tokenFromHeader;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let userCheck;
        userCheck = await User.findById(decoded.id)
        if (userCheck) {
            req.auth = userCheck;
        }
        else {
            return res.status(401).json({ message: "Please login again" })
        }
        next();
    },
}


export default authToken;