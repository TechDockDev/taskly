import express from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoute.js'
import userRoutes from './routes/userRoute.js'
import settingRoutes from './routes/settingRoute.js'

const app = express();
app.use(express.json());

connectDB();
app.use('/api/v1/user',taskRoutes)
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/settings', settingRoutes);
app.listen(3000,()=>{
    console.log("Server is running 🔥")
})