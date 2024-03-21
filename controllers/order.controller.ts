import { getAllOrdersService } from './../services/order.service';
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel, { IOrder } from "../models/order.model";
import NotificationModel from "../models/notification.model";
import path from "path";
import ejs from 'ejs'
import sendMail from "../utils/sendMail";
import { newOrder } from "../services/order.service";


export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder
        const user = await UserModel.findById(req.user?._id);
        const courseExistForUser = user?.courses.some((course: any) => course._id.toString() === courseId);
        if (courseExistForUser) {
            return next(new ErrorHandler("You have purchased this course already", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        const data: any = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        }

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        }


        const html = await ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'), { order: mailData })

        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }

        user?.courses.push(course?._id);
        await user?.save();
        await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${user?.name}`,
        })
        course.purchased ? (course.purchased += 1) : (course.purchased = 1);

        await course.save();
        newOrder(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Only for admins
export const getAllOrders = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})