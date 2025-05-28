import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    firebaseUid: {
        type: String,
        require: true
    },
    email:{
        type: String,
        unique:true
    },
    photo:{
        type: String,
        require: true
    }
})

const userModel = new mongoose.model('User', userSchema);
export default userModel;