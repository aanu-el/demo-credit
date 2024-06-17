import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
require('dotenv').config();

import db from '../config/db.config';
import { User } from '../db/models/users.model';
import { generateWallet } from '../utils/services_helper.utils';


const SECRET_KEY: any = process.env.SECRET_KEY;


export const signup = async (userData: User): Promise<User> => {
    //check if the user exists already by email
    const userLookup = await db<User>('users').where({ email: userData.email }).first();
    if (userLookup) {
        throw new Error('User exists! Please sign in');
    }
    // check if the user is on karma list

    // generate user uuid
    const user_uuid = uuidv4();

    // hash the user password
    const hashedPassword = await bcrypt.hash(userData.password.trim(), 10);

    // assign the status of pending to the user
    const status = "active";

    // generate account number
    const account_number = await generateWallet(userData)

    // save into db
    const [newUser] = await db<User>('users').insert({...userData, user_uuid: user_uuid,  password: hashedPassword, status: status,  wallet_id: account_number.id}).returning('*');

    return newUser;
};

export const signin = async (email: string, password: string): Promise<string> => {
    const user = await db<User>('users').where({ email }).first();
    if (!user) {
      throw new Error('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
  
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '0.5h' });
    return token;
  };