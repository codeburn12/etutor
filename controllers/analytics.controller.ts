import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get user analytics for admins
export const getUserAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersData = await generateLast12MonthsData(UserModel); // Await the function call
        
        res.status(200).json({
            success: true,
            usersData // Access the correct property from the returned object
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseData = await generateLast12MonthsData(CourseModel); // Await the function call

        res.status(200).json({
            success: true,
            courseData // Access the correct property from the returned object
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getOrderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderData = await generateLast12MonthsData(OrderModel); // Await the function call

        res.status(200).json({
            success: true,
            orderData // Access the correct property from the returned object
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
