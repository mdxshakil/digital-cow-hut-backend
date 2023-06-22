import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getUsers = async (): Promise<IUser[]> => {
  const users = await User.find();
  if (!users.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not get users');
  }
  return users;
};

const getSingleUser = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById({ _id: userId });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found !');
  }
  return user;
};

const deleteSingleUser = async (userId: string): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: userId });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found !');
  }
  const user = await User.findByIdAndDelete({ _id: userId });
  return user;
};

const updateUser = async (
  userId: string,
  updatedData: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: userId });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found !');
  }

  const { name, ...userData } = updatedData;

  const updatedUserData: Partial<IUser> = { ...userData };

  // dynamically handling user name
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await User.findOneAndUpdate({ _id: userId }, updatedUserData, {
    new: true,
  });
  return result;
};

export const UserService = {
  getUsers,
  getSingleUser,
  deleteSingleUser,
  updateUser,
};
