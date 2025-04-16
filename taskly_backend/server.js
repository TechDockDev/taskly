import express from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoute.js'

const app = express();
app.use(express.json());

connectDB();
app.use('/api/v1/user',taskRoutes)
app.listen(3000,()=>{
    console.log("Server is running 🔥")
})