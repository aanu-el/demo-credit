import db from '../config/db.config';
import { User } from '../db/models/users.model';

export const getUserProfile = async (user_uuid: string): Promise<any> => {
  const user = await db<User>('users').where({ user_uuid }).first();
  return user;
};
