import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.mjs';
import userRoutes from './routes/userRoutes.mjs';
import expenseRoutes from './routes/expenseRoutes.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.get("/",async (req,res)=>{
  res.send("Hello Convin Ai,this is homepage for our Expense Splitter");
})
// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
