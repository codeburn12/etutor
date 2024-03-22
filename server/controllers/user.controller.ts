// Import necessary modules and interfaces
require('dotenv').config(); // Load environment variables from a .env file
import { Request, Response, NextFunction } from "express"; // Import express types
import UserModel, { IUser } from "../models/user.model"; // Import user model and IUser interface
import ErrorHandler from "../utils/ErrorHandler"; // Import custom error handler
import { CatchAsyncError } from "../middleware/catchAsyncError"; // Import async error handler
import jwt, { Secret, JwtPayload } from "jsonwebtoken"; // Import JWT and related types
import ejs from 'ejs'; // Import ejs templating engine
import path from "path"; // Import path module for file paths
import { sendMail } from "../utils/sendMail"; // Import function for sending emails
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt"; // Import JWT related functions and options
import { redis } from "../utils/redis"; // Import Redis client
import { getAllUsersService, getUserById, updateUsersRoleService } from "../services/user.service"; // Import function to get user by ID
import cloudinary from 'cloudinary'; // Import cloudinary for image handling

// Define interfaces for registration, activation, login, social authentication, and user updates
interface IRegistration {
    name: string;
    email: string;
    password: string;
    avatar?: string;
};

interface IActivationToken {
    token: string;
    activationCode: string;
}

interface IActivationRequest {
    activation_code: string;
    activation_token: string;
}

interface ILoginUser {
    email: string;
    password: string;
}

interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
}

interface IUpdateUserInfo {
    name: string;
    email: string;
}

interface IUpdateUserPassword {
    oldPassword: string;
    newPassword: string;
}

interface IUpdateUserAvatar {
    avatar: string;
}

// Registration route handler
export const userRegistration = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract registration data from request body
        const { name, email, password } = req.body;
        // Check if email already exists in the database
        const emailExist = await UserModel.findOne({ email });
        if (emailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        // Prepare user registration data
        const user: IRegistration = {
            name, email, password,
        }

        // Create activation token and code
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

        // Send activation email
        await sendMail({
            email: user.email,
            subject: "Internship letter",
            template: "activation-mail.ejs",
            data,
        });

        // Send response with activation token
        res.status(201).json({
            success: true,
            message: `Please check your email ${user.email} to activate your account`,
            activationToken: activationToken.token,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Function to create activation token
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: "5m" });
    return { token, activationCode };
}

// Activation route handler
export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_code, activation_token } = req.body as IActivationRequest;
        const newUser: { user: IUser, activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: IUser, activationCode: string }

        // Verify activation code
        if (newUser.activationCode != activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        // Check if user already exists
        const { name, email, password } = newUser.user;
        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        // Create new user
        const user = await UserModel.create({
            name, email, password,
        });

        // Send success response
        res.status(201).json({
            success: true,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Login route handler
export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body as ILoginUser;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        // Find user by email and select password field
        const user = await UserModel.findOne({ email }).select("+password")
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Compare passwords
        const matchPassword = await user.comparePassword(password);
        if (!matchPassword) {
            return next(new ErrorHandler("Wrong password", 400));
        }

        // Send access and refresh tokens
        sendToken(user, 200, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Logout route handler
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear cookies and delete session from Redis
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id || '';
        redis.del(userId);
        // Send success response
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Route handler to update access token using refresh token
export const updatedAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract refresh token from cookies
        const refresh_token = req.cookies.refresh_token as string;
        // Verify refresh token
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;
        if (!decoded) {
            return next(new ErrorHandler("Refresh token is not valid", 400));
        }
        // Get session from Redis
        const session = await redis.get(decoded.id as string);
        if (!session) {
            return next(new ErrorHandler("Please login to access this resourse", 400));
        }

        // Generate new access and refresh tokens
        const user = JSON.parse(session);
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, { expiresIn: '3d' });
        req.user = user;
        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        await redis.set(user._id, JSON.stringify(user), "EX", 604800);

        // Send success response with new access token
        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

// Route handler to get user info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user ID from request
        const userId = req.user?._id;
        // Get user by ID
        getUserById(userId, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Route handler for social authentication
export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract social auth data from request body
        const { email, name, avatar } = req.body as ISocialAuthBody;
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            // Create new user if not exists
            const newUser = await UserModel.create({ name, email, avatar });
            sendToken(newUser, 200, res);
        } else {
            // Send tokens if user exists
            sendToken(user, 200, res);
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Route handler to update user info
export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract updated user info from request body
        const { name, email } = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        // Find user by ID
        const user = await UserModel.findById(userId);
        if (user && email) {
            // Check if email already exists
            const emailExist = await UserModel.findOne({ email });
            if (emailExist) {
                return next(new ErrorHandler("Email already exists", 400));
            }
            user.email = email;
        }

        if (user && name) {
            user.name = name;
        }

        // Save updated user
        await user?.save();
        // Update user in Redis
        await redis.set(userId, JSON.stringify(user));

        // Send success response with updated user
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Route handler to update user password
export const updateUserPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract old and new passwords from request body
        const { oldPassword, newPassword } = req.body as IUpdateUserPassword;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }

        const userId = req.user?._id;
        // Find user by ID and select password field
        const user = await UserModel.findById(userId).select("+password");
        if (user?.password === undefined) {
            return next(new ErrorHandler("Unknown User", 400));
        }

        // Compare old password
        const matchPassword = await user?.comparePassword(oldPassword);
        if (!matchPassword) {
            return next(new ErrorHandler("Invalid old Password", 400));
        }
        user.password = newPassword;

        // Save updated user
        await user.save();
        // Update user in Redis
        await redis.set(userId, JSON.stringify(user));

        // Send success response with updated user
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Route handler to update user avatar
export const updateUserAvatar = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract new avatar from request body
        const { avatar } = req.body as IUpdateUserAvatar;

        const userId = req.user?._id;
        // Find user by ID
        const user = await UserModel.findById(userId);

        if (avatar && user) {
            if (user?.avatar?.public_id) {
                // Destroy old avatar from cloudinary
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                // Upload new avatar to cloudinary
                const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars", width: 150 });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            } else {
                // Upload new avatar to cloudinary if old avatar does not exist
                const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars", width: 150 });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }
        }

        // Save updated user
        await user?.save();
        // Update user in Redis
        await redis.set(userId, JSON.stringify(user));

        // Send success response with updated user
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Only for admins
export const getAllUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUsersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        updateUsersRoleService(res, id, role);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }
        await user.deleteOne({ userId });
        await redis.del(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})