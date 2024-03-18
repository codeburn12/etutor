require('dotenv').config();
import { Response, Request, NextFunction } from "express";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";
import cloudinary from 'cloudinary'
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";

export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "courses", width: 150 });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
        
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })


// export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// })

