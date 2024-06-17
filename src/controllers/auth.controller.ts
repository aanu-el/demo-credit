import { Request, Response } from 'express';
import { signup, signin } from '../services/auth.service';
import { User } from '../db/models/users.model';

export const signupController = async (req: Request, res: Response) => {
  try {
    const newUser: User = req.body;
    const user = await signup(newUser);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const signinController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await signin(email, password);
    res.status(200).json({ token });
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};
