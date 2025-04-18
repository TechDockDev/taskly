import User from '../models/userModel.js';

export const Edit_Notification_Preference_Setting = async (req, res) => {
  try {
    const userId = req.auth.id;
    const { notificationPreference } = req.body;

    const allowedPrefs = ['location', 'dueDate', 'both'];
    if (!allowedPrefs.includes(notificationPreference)) {
      return res.status(400).json({ message: 'Invalid notification preference' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { notificationPreference },
      { new: true }
    );

    res.status(200).json({
      message: 'Notification preference updated successfully',
      preference: user.notificationPreference
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

export const Get_Notification_Preference_Setting = async(req, res) => {
    
}