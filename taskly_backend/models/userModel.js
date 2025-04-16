import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    phoneNumber:{
        type: String,
        unique: true
    },
    isLocationPermission:{
        type: Boolean
    },
    isNotificationPermission:{
        type: Boolean
    },
    notificationPreference: {
        type: String,
        enum: ['location', 'dueDate', 'both'],
        default: 'both'
    }
})

const userModel = new mongoose.model('User', userSchema);
export default userModel;