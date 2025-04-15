import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    phoneNumber:{
        type: String,
        unique: true
    },
    isLoactionPermission:{
        type: Boolean
    },
    isNotificationPermission:{
        type: Boolean
    }
})

const userModel = new mongoose.model('User', userSchema);
export default userModel;