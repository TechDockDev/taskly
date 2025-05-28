import express from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoute.js'
import userRoutes from './routes/userRoute.js'
import settingRoutes from './routes/settingRoute.js'
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

connectDB();
app.use('/api/v1/user',taskRoutes)
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/settings', settingRoutes);
app.listen(process.env.PORT,()=>{
    console.log("Server is running 🔥")
})