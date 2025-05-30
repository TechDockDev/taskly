import mongoose from "mongoose";

const guestUserSchema = mongoose.Schema({
    guestId:{
        type:String,
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
})

const guestUserModel = new mongoose.model('GuestUser', guestUserSchema);
export default guestUserModel;