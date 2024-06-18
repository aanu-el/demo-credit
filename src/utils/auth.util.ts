import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

require('dotenv').config();

const SECRET_KEY: any = process.env.SECRET_KEY;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (id: any, email: string, user_uuid: string): string => {
    return jwt.sign({ id, email, user_uuid }, SECRET_KEY, { expiresIn: '0.5h' });
};

export const getUserFromToken = (token: any): any => {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    return decoded
};

export const checkKarmaList = async (param: any): Promise<any> => {
    let API_URL;
    if (param) {
        API_URL = `https://adjutor.lendsqr.com/v2/verification/karma/${param}`;
    } else {
        API_URL = "https://adjutor.lendsqr.com/v2/verification/karma/0zspgifzbo.ga"
    }
    const ADJUTOR_API_TOKEN = process.env.ADJUTOR_API_TOKEN

    const resolveUrl = await fetch(API_URL, {
        method: 'GET',
        headers: { "Authorization":  `Bearer ${ADJUTOR_API_TOKEN}`}
    })
    const response = await resolveUrl.json()

    if (response.status === 200) {
        return { status: true, "message": "User Blacklisted"}
    } else {
        return { status: false, "message": "User is not blacklisted"}
    }
}