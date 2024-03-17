// Importing the ErrorHandler class from the ErrorHandler utility file
import ErrorHandler from "../utils/ErrorHandler";
// Importing necessary modules from Express
import { Request, Response, NextFunction } from "express";

// Error handling middleware function
const ErrorMiddleWare = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Set default status code and message for the error
    err.statusCode = err.statusCode || 500;
    err.message = err.message || `Internal Server Error`;

    /* ___________________________MongoDB Error_____________________________*/

    // Handle wrong MongoDB Id error
    if (err.name === "CastError") {
        const message = `Resources not found. Invalid ${err.path}`;
        // Create new ErrorHandler instance for the specific error
        err = new ErrorHandler(message, 400);
    }

    // Handle duplicate key error
    if (err.name === 'MongoError' && err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        // Create new ErrorHandler instance for the specific error
        err = new ErrorHandler(message, 400);
    }

    /* ______________________________JWT Error______________________________*/

    // Handle wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json web token invalid, try again`;
        // Create new ErrorHandler instance for the specific error
        err = new ErrorHandler(message, 400);
    }

    // Handle JWT expired token error
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token Expired, try again`;
        // Create new ErrorHandler instance for the specific error
        err = new ErrorHandler(message, 400);
    }

    // Send response with appropriate status code and error message
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}

// Export the ErrorMiddleWare function as default
export default ErrorMiddleWare;
