import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    taskId:{
        type: mongoose.Types.ObjectId,
        ref:'Task'
    },
    title:{
        type: String,
        required: true
    },
    messageId:{
        type: String,
    },
    message:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
},{timestamps:true});

const notificationModel = new mongoose.model('Notification', notificationSchema);
export default notificationModel;