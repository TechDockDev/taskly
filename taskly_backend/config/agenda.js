import Agenda from 'agenda';
import dotenv from 'dotenv';
dotenv.config();
const mongoConnectionString = process.env.MONGO_URL;

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: 'scheduledTasks' },
  processEvery: '1 second',
});

export default agenda;
