import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    return decoded.user
};
