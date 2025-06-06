import cron from 'node-cron';
import Task from '../models/taskModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
import firebaseAdmin from '../config/firebase.config.js';

const dateToCron = (date) => {
  const d = new Date(date);
  console.log('Niche Cron ka time hai---->');
  console.log(`${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`)
  return `${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
};

export const scheduleNotification = (task, userId) => {
  const cronTime = dateToCron(task.notifyAt);

  cron.schedule(cronTime, async () => {
    const user = await User.findById(userId);
    console.log('User->>>>>', user);
    console.log('Task->>>>', task);
    const title = "Due Date Remainder";
    const messageBody = `Hey! Complete ${task.title} before it expires.`
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
        messageId
    })
    console.log('Woooho Message sent successfully --->', notification);
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
};
