import express from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoute.js'
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/a'
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

connectDB();
app.use('/api/v1/user',taskRoutes)
app.use('/api/v1/auth', );
app.use('/api/v1/userDetails', userRoutes)
app.listen(process.env.PORT,()=>{
    console.log("Server is running 🔥"+process.env.PORT)
})