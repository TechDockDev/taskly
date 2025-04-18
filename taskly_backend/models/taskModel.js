import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        // required: true
    },
    location:{
        latitude:{
            type: String,
            required:true
        } ,
        longitude:{
            type: String,
            required:true
        }
    },
    date:{
        type:Date
    },
    status:{
        type: String,
        enum:["pending", "completed"],
        default: "pending"
    },
    ringType:{
        type: String,
        enum:["short", "long"],
        default:"short"
    },
    radius:{
        type:Number,
        default:100
    }
},{timestamps:true});

const taskModel = new mongoose.model('Task', taskSchema);

export default taskModel;