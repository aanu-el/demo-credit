import { Request, Response } from 'express';
import { getUserProfile } from '../services/users.service';
import { getUserFromToken } from '../utils/auth.util';

export const getProfileController = async (req: Request, res: Response) => {
    try {
        //  get user_uuid from token
        const token = req.headers.authorization?.split(' ')[1];
        const user_uuid = await getUserFromToken(token).user_uuid;

        const user = await getUserProfile(user_uuid);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


