require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from './catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redis } from '../utils/redis';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    if (!access_token) {
        return next(new ErrorHandler("Log In to access the resource", 400));
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
    if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler("Please login to access this resourse", 400));
    }
    
    req.user = JSON.parse(user);
    next();
})

export const authUserRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }

        next();
    }
}
