import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
require('dotenv').config();

import db from '../config/db.config';
import { User } from '../db/models/users.model';

const SECRET_KEY = process.env.SECRET_KEY;


export const signup = async (userData: User): Promise<User> => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [newUser] = await db<User>('users')
        .insert({ ...userData, password: hashedPassword })
        .returning('*');
    return newUser;
};