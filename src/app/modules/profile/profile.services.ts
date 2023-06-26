import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IUser } from '../auth/auth.interface';
import { User } from '../user/user.model';

const getMyProfile = async (
  userId: string,
  role: string
): Promise<IUser | IAdmin | null> => {
  let result = null;
  if (role === 'admin') {
    result = await Admin.findOne({ _id: userId });
  }
  if (role === 'buyer' || role === 'seller') {
    result = await User.findOne({ _id: userId });
  }

  return result;
};

const updateMyProfile = async (
  userId: string,
  role: string,
  updatedData: Partial<IUser | IAdmin>
): Promise<IUser | IAdmin | null> => {
  // check if the user exists or not
  let isExist;
  if (role === 'admin') {
    isExist = await Admin.findOne({ _id: userId });
  } else if (role === 'seller' || role === 'buyer') {
    isExist = await User.findOne({ _id: userId });
  }
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found !');
  }

  const { name, password, ...userData } = updatedData;

  const updatedUserData: Partial<IUser | IAdmin> = { ...userData };

  // dynamically handling user name object
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser | IAdmin>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
    updatedUserData.password = hashedPassword;
  }

  let result = null;
  if (role === 'admin') {
    result = await Admin.findOneAndUpdate({ _id: userId }, updatedUserData, {
      new: true,
    });
  } else if (role === 'seller' || role === 'buyer') {
    result = await User.findOneAndUpdate({ _id: userId }, updatedUserData, {
      new: true,
    });
  }
  return result;
};

export const ProfileService = {
  getMyProfile,
  updateMyProfile,
};
