import { Response } from "express";
import { redis } from "../utils/redis";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";

export const createCourse = CatchAsyncError(async (data: any, res: Response) => {
    
})