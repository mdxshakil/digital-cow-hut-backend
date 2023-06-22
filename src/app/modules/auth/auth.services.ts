import { User } from '../user/user.model';
import { IUser } from './auth.interface';

const createUser = async (userData: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(userData);
  return createdUser;
};

export const AuthService = {
  createUser,
};
