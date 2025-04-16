import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String
    },
    location:{
        latitude: String,
        longitude: String
    },
    date:{
        type:Date
    },
    status:{
        type: String,
        enum:["pending", "completed"]
    },
    ringType:{
        type: String,
        enum:["short", "long"]
    },
    radius:{
        type:Number
    }
},{timestamps:true});

const taskModel = new mongoose.model('Task', taskSchema);

export default taskModel;