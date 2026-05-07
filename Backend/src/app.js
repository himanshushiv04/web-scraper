import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Routes import 
import userRouter from './routes/user.routes.js';

const app = express();


// CORS error handling
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Application Level Middleware

// accepting json data
app.use(express.json());

// URL data handling
app.use(express.urlencoded({ extended: true }));

// cookie handling
app.use(cookieParser());


// Routes
app.use('/api/v1/users', userRouter);


export { app };
