import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    title:{
        type:String,
        required: true
    },
    tag:{
        type:String,
        required:true
    },
    location:{
        latitude:{
            type: String,
        },
        longitude:{
            type: String,
        }
    },
    address:{
        type:String,
        required: true
    },
    dueDateTime:{
        type:Date
    },
    status:{
        type: String,
        enum:["pending", "completed", "overdue"],
        default: "pending"
    },
    ringType:{
        type: String,
        enum:["once", "repeat"],
        default:"once",
    },
    notifyType:{
        type: String,
        enum: ["nearby", "dueDate"], 
        default: "nearby"
    },
    notifyAt:{
        type:Date,
    },
    radius:{
        type:Number,
        default:100
    }
},{timestamps:true});

const taskModel = new mongoose.model('Task', taskSchema);

export default taskModel;