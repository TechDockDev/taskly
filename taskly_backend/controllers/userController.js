import User from '../models/userModel'

export const Get_Single_User = async () => {
    const userId = req.auth.id;
    if(!userId){
        return res.status(400).json({message:"No UserId Provided", success:false})
    }
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"No User Found", success:false});
        }
        return res.status(200).json({message:"User Found", success:true, user});
    } catch (error) {
        console.log('Error In getting User', error.message);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}