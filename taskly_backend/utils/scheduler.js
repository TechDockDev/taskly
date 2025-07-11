// import agenda from '../config/agenda.js';
// import Task from '../models/taskModel.js';
// import Notification from '../models/notificationModel.js';
// import User from '../models/userModel.js';
// import firebaseAdmin from '../config/firebase.config.js';
// import mongoose from 'mongoose';
// import moment from 'moment';



// (async () => {
//   try {
//     console.log('Attempting to start Agenda...');
//     await agenda.start();
//     console.log('Agenda started successfully');
//   } catch (error) {
//     console.error('Error starting Agenda:', error);
//   }
// })();

// agenda.define('notify', async (job) => {
//   console.log('job=>', job);
//   let { taskId, userId, dataPayload } = job.attrs.data;
//   console.log('taskId--->', taskId);
//   taskId = taskId.toString()
//   console.log('Converted Task Id-->', taskId);
//   const user = await User.findById(userId);
//   const task = await Task.findById(taskId);
//   console.log('Task-->', task);
//   if (!user || !task) {
//     console.error('User or task not found:', { userId, taskId });
//     return;
//   }

//   console.log("datapayload-->", dataPayload)
//   const title = "Due Date Reminder";
//   const messageBody = `Hey! Complete ${task.title} before it expires.`;

//   let messages = {
//     token: user.fcmToken,
//     notification: {
//       title: title,
//       body: messageBody,
//     },
//     // priority:"high",

//     data: 
//       Object.fromEntries(
//         Object.entries(dataPayload).map(([key, value]) => [key, String(value)])
//       ),
    
//     android: {
//       priority: 'high',
//       notification: {
//         channelId: '59054',
//         channelId: "alarm_channel",
//       }
//     },
//     apns: {
//       payload: {
//         aps: {
//           sound: 'alarm_sound.wav', // For iOS
//           'mutable-content': 1,
//           'content-available': 1,
//         },
//       },
//     },
//   };
//   try {
//     const messageId = await firebaseAdmin.messaging().send(messages);
//     console.log("MessageId-->", messageId);
//     const notification = await Notification.create({
//       userId,
//       taskId: task._id,
//       title,
//       message: messageBody,
//       messageId,
//     });
//     console.log("After sending notification")

//     console.log('Woooho Message sent successfully --->', notification);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// });

// agenda.define('start-repeat-notification', async (job) => {
//   const jobData = job.attrs.data;

//   // Just in case, cancel any existing repeat jobs for this task
//   await agenda.cancel({ 'data.taskId': jobData.taskId });

//   // Start repeating every 10 minutes
//   await agenda.every('10 minutes', 'notify', jobData);
//   console.log(`Repeating notification started for task ${jobData.taskId}`);
// });


// // export const scheduleNotification = async (task, userId) => {
// //   await agenda.cancel({ 'data.taskId': task._id });
// //   if (!task.notifyAt) return;

// //   const notifyTime = moment.tz(task.notifyAt, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata').toDate();

// //   const jobData = {
// //     taskId: task._id,
// //     userId,
// //     dataPayload: {
// //       taskId: task._id,
// //       notifyType: 'dueDate',
// //       channelId: 'alarm_channel',
// //       title: "Due Date Reminder",
// //       messageBody: `Hey! Complete ${task.title} before it expires.`,
// //       taskType: task.ringType
// //     }
// //   };
// //   if (task.ringType === 'repeat') {
// //     await agenda.every(`${process.env.REPEAT_TIME}`, 'notify', jobData, { startDate: notifyTime });
// //     console.log(`Repeating notification scheduled every 5 minutes for task ${task._id} starting from ${notifyTime}`);
// //   } else {
// //     await agenda.schedule(notifyTime, 'notify', jobData);
// //     console.log(`One-time notification scheduled for task ${task._id} at ${notifyTime}`);
// //   }
// // };

// export const scheduleNotification = async (task, userId) => {
//   // Cancel existing jobs for the same task
//   await agenda.cancel({ 'data.taskId': task._id });

//   if (!task.notifyAt) return;

//   const notifyTime = moment.tz(task.notifyAt, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata').toDate();

//   const jobData = {
//     taskId: task._id,
//     userId,
//     dataPayload: {
//       taskId: task._id,
//       notifyType: 'dueDate',
//       channelId: 'alarm_channel',
//       title: "Due Date Reminder",
//       messageBody: `Hey! Complete ${task.title} before it expires.`,
//       taskType: task.ringType
//     }
//   };

//   if (task.ringType === 'repeat') {
//     await agenda.schedule(notifyTime, 'start-repeat-notification', jobData);
//     console.log(`Scheduled repeat start for task ${task._id} at ${notifyTime}`);
//   } else {
//     await agenda.schedule(notifyTime, 'notify', jobData);
//     console.log(`One-time notification scheduled for task ${task._id} at ${notifyTime}`);
//   }
// };



// export const cancelNotification = async (taskId) => {
//   try {
//     const taskIdObj = new mongoose.Types.ObjectId(taskId);
//     console.log("Task Id (ObjectId)--->", taskIdObj);

//     const canceledJobs = await agenda.cancel({ 'data.taskId': taskIdObj });
//     console.log(`🗑️ Canceled ${canceledJobs} job(s) for task ${taskId}`);
//   } catch (error) {
//     console.error('❌ Failed to cancel notification:', error.message);
//     throw error;
//   }
// };










import agenda from '../config/agenda.js';
import Task from '../models/taskModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
import firebaseAdmin from '../config/firebase.config.js';
import mongoose from 'mongoose';
import moment from 'moment';



(async () => {
  try {
    console.log('Attempting to start Agenda...');
    await agenda.start();
    console.log('Agenda started successfully');
  } catch (error) {
    console.error('Error starting Agenda:', error);
  }
})();

agenda.define('notify', async (job) => {
  console.log('job=>', job);
  let { taskId, userId, dataPayload } = job.attrs.data;
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

  console.log("datapayload-->", dataPayload)
  const title = "Due Date Reminder";
  const messageBody = `Hey! Complete ${task.title} before it expires.`;

  let messages = {
    token: user.fcmToken,
    notification: {
      title: title,
      body: messageBody,
    },
    // priority:"high",
    data: 
      Object.fromEntries(
        Object.entries(dataPayload).map(([key, value]) => [key, String(value)])
      ),
    
    android: {
      priority: 'high',
      notification: {
        channelId: '59054',
        channelId: "alarm_channel",
      }
    },
    apns: {
      payload: {
        aps: {
          sound: 'alarm_sound.wav', // For iOS
          'mutable-content': 1,
          'content-available': 1,
        },
      },
    },
  };
  try {
    const messageId = await firebaseAdmin.messaging().send(messages);
    console.log("MessageId-->", messageId);
    const notification = await Notification.create({
      userId,
      taskId: task._id,
      title,
      message: messageBody,
      messageId,
    });
    console.log("After sending notification")

    console.log('Woooho Message sent successfully --->', notification);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
});

export const scheduleNotification = async (task, userId) => {
  await agenda.cancel({ 'data.taskId': task._id });
  if (!task.notifyAt) return;

  const notifyTime = moment.tz(task.notifyAt, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata').toDate();

  const jobData = {
    taskId: task._id,
    userId,
    dataPayload: {
      taskId: task._id,
      notifyType: 'dueDate',
      channelId: 'alarm_channel',
      title: "Due Date Reminder",
      messageBody: `Hey! Complete ${task.title} before it expires.`,
      taskType: task.ringType
    }
  };
  if (task.ringType === 'repeat') {
    await agenda.every('1 minute', 'notify', jobData, { startDate: notifyTime });
    console.log(`Repeating notification scheduled every 5 minutes for task ${task._id} starting from ${notifyTime}`);
  } else {
    await agenda.schedule(notifyTime, 'notify', jobData);
    console.log(`One-time notification scheduled for task ${task._id} at ${notifyTime}`);
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