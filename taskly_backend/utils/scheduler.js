import agenda from '../config/agenda.js';
import Task from '../models/taskModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
import firebaseAdmin from '../config/firebase.config.js';
import mongoose from 'mongoose';
import moment from 'moment';

agenda.define('send task notification', async (job) => {
  let { taskId, userId } = job.attrs.data;
  console.log('taskId--->', taskId);
  taskId = taskId.toString()
  console.log('Converted Task Id-->', taskId);
  const user = await User.findById(userId);
  const task = await Task.findById(taskId);
  console.log('Task-->', task);
  if (!user || !task) {
    console.error('User or task not found:', { userId, taskId });
    return;
  }

  const title = "Due Date Reminder";
  const messageBody = `Hey! Complete ${task.title} before it expires.`;
  
  try {
    const messageId = await firebaseAdmin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: title,
        body: messageBody,
      },
    });
    
    const notification = await Notification.create({
      userId,
      taskId: task._id,
      title,
      message: messageBody,
      messageId,
    });
    
    console.log('Woooho Message sent successfully --->', notification);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
});

// Start Agenda
(async () => {
  await agenda.start();
})();

export const scheduleNotification = async (task, userId) => {
  // Cancel any existing job for this task to avoid duplicates
  console.log("Taskkkk->>",task._id);
  const canceld = await agenda.cancel({ 'data.taskId': task._id });
  console.log("Cancelled--->",canceld);
  
  // Schedule a new job if notifyAt is set
  if (task.notifyAt) {
    const notify = moment.tz(task.notifyAt, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata').toDate();
    await agenda.schedule(notify, 'send task notification', {
      taskId: task._id,
      userId,
    });
    console.log(`Notification scheduled for task ${task._id} at ${notify}`);
  }
};


export const cancelNotification = async (taskId) => {
  try {
    const taskIdObj = new mongoose.Types.ObjectId(taskId);
    console.log("Task Id (ObjectId)--->", taskIdObj);

    const canceledJobs = await agenda.cancel({ 'data.taskId': taskIdObj });
    console.log(`🗑️ Canceled ${canceledJobs} job(s) for task ${taskId}`);
  } catch (error) {
    console.error('❌ Failed to cancel notification:', error.message);
    throw error;
  }
};