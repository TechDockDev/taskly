import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema({
    otp:{
        type: String,
        required: true
    },
    email:{
        type: String, 
        unique: true
    },
    otpExpiry:{
        type:Date
    }
},{timestamps:true});

const otpModel = new mongoose.model('OtoVerify', otpSchema);

export default otpModel;