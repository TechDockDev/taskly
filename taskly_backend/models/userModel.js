import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
        type: String,
        // required: true,
    },
    firebaseUid: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    photo: {
        url:{
            type:String,
        },
        public_id:{
            type: String,
        }
    },
    tags: {
        type: [String],
        default: []
    },
    fcmToken: {
        type: String,
       // required: true
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.isMatch = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const userModel = mongoose.model('User', userSchema);
export default userModel;
