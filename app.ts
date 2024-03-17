// Load environment variables from a .env file
require('dotenv').config();

// Import necessary modules
import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorMiddleWare from './middleware/error';
import userRouter from "./routes/user.route";

// Create Express application instance
export const app = express();

// Body parser middleware to parse incoming JSON data
app.use(express.json({ limit: "50mb" }));

// Cookie parser middleware to parse cookies from incoming requests
app.use(cookieParser());

// Cross-origin resource sharing middleware to allow requests from specified origins
app.use(cors({ origin: process.env.ORIGIN }));

// routes
app.use("/api/v1", userRouter);

// Testing route to check if API is working
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});

// Unknown route handler to catch requests to non-existent routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    // Create a 404 error for unknown routes
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

// Error handling middleware to handle errors in the application
app.use(ErrorMiddleWare);
