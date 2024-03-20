import { title } from 'process';
import { Response, Request, NextFunction } from "express";
import cloudinary from 'cloudinary'
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from 'ejs'
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from '../models/notification.model';

export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "courses" });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        createCourse(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "courses" });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        const courseId = req.params.id;
        const course = await CourseModel.findByIdAndUpdate(courseId, { $set: data, }, { new: true, });
        res.status(201).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id
        const cacheExist = await redis.get(courseId);
        if (cacheExist) {
            const course = JSON.parse(cacheExist);
            res.status(201).json({
                success: true,
                course,
            });
        }
        else {
            const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            await redis.set(courseId, JSON.stringify(course));

            res.status(201).json({
                success: true,
                course,
            });
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

export const getAllCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheExist = await redis.get("allcourses");
        if (cacheExist) {
            const courses = JSON.parse(cacheExist);
            res.status(201).json({
                success: true,
                courses,
            });
        }
        else {
            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set("allcourses", JSON.stringify(courses));
            res.status(201).json({
                success: true,
                courses,
            });
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        
        const courseId = req.params.id;

        const courseExists = userCourseList?.find((course: any) => course._id === courseId);
        if (!courseExists) {
            return next(new ErrorHandler("You are not available to access this course", 500));
        }

        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;
        

        res.status(200).json({
            success: true,
            content,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

interface IAddQuestions {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestions = req.body;
        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Content Id is invalid", 400));
        }

        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: [],
        }
        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have new question from ${courseContent.title}`,
        })

        await course?.save();
        res.status(200).json({
            success: true,
            course,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

interface IAddAnswer {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswer = req.body;
        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Content Id is invalid", 400));
        }

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        if (!question) {
            return next(new ErrorHandler("Question Id is invalid", 400));
        }



        const newAnswer: any = {
            user: req.user,
            answer,
        }
        question.questionReplies?.push(newAnswer);

        await course?.save();

        if (req.user?._id === question.user._id) {
            await NotificationModel.create({
                user: req.user?._id,
                title: "New Question Reply Received",
                message: `You have new question reply from ${courseContent.title}`,
            })
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            }

            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-replies.ejs"), data);
            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-replies.ejs",
                    data,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500));
            }
        }

        res.status(200).json({
            success: true,
            course,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


interface IAddReview {
    review: string;
    courseId: string;
    rating: number;
    userId: string;
}

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const userCourseList = req.user?.courses;
        
        const courseId = req.params.id;
       
        const courseExist = userCourseList?.some((course: any) => course._id.toString() === courseId.toString());

        if (!courseExist) {
            return next(new ErrorHandler("This course does not exist", 404));
        }

        const course = await CourseModel.findById(courseId);

        const { review, rating }: IAddReview = req.body;

        const reviewData: any = {
            user: req.user,
            rating,
            comment: review,
            
        }
        course?.reviews.push(reviewData);

        let avg = 0;
        course?.reviews.forEach((review: any) => {
            avg += review.rating;
        });

        if (course) {
            course.rating = avg / course.reviews.length;
        }

        await course?.save();

        const notification = {
            title: "New Review Received",
            message: `${req.user?.name} ha given a review in ${course?.name}`
        }

        // Create notification

        res.status(200).json({
            success: true,
            course,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


interface IAddReviewReplies {
    comment: string;
    courseId: string;
    reviewId: number;
}

export const addReviewReplies = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { comment, courseId, reviewId }: IAddReviewReplies = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("This course does not exist", 404));
        }

        const review = course.reviews?.find((review: any) => review._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("This review does not exist", 404));
        }

        const replyData: any = {
            user: req.user,
            comment,
        }
        course?.reviews.push(replyData);

        await course?.save();

        res.status(200).json({
            success: true,
            course,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

