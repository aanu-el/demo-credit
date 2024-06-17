import db from '../config/db.config';
import { User } from '../db/models/users.model';

export const getUserById = async (id: number): Promise<User | undefined> => {
  const user = await db<User>('users').where({ id }).first();
  return user;
};

export const addUser = async (user: User): Promise<User> => {
  const [newUser] = await db<User>('users').insert(user).returning('*');
  return newUser;
};
