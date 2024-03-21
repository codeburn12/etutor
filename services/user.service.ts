import UserModel from "../models/user.model";
import { Response } from "express";
import { redis } from "../utils/redis";


export const getUserById = async (id: string, res: Response) => {
    const userJson = await redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(200).json({
            success: true,
            user,
        })
    }
}

export const getAllUsersService = async (res: Response) => {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        users,
    })
}

export const updateUsersRoleService = async (res: Response, id: string, role: string) => {
    const users = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(200).json({
        success: true,
        users,
    })
}