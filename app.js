import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());


app.use('/users', userRoutes);

app.use(errorHandler);

export default app;

