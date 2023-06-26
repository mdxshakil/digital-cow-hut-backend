import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { jwtHelper } from '../../../shared/jwtHelper';
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  const createdAdmin = await Admin.create(adminData);
  if (!createdAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
  }
  const createdNewAdmin = await Admin.findOne({ _id: createdAdmin._id });
  return createdNewAdmin;
};

const loginAdmin = async (
  userLoginData: ILoginAdmin
): Promise<ILoginAdminResponse | null> => {
  const { phoneNumber, password } = userLoginData;

  const admin = new Admin();
  const isAdminExists = await admin.isAdminExists(phoneNumber);
  if (!isAdminExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exists!');
  }
  //match password
  if (
    isAdminExists?.password &&
    !(await admin.isPasswordMatched(password, isAdminExists?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //create access token and refresh token
  const { _id, role } = isAdminExists;
  const accessToken = jwtHelper.createToken(
    {
      userId: _id,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelper.createToken(
    {
      userId: _id,
      role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getAdminProfile = async (userId: string): Promise<IAdmin | null> => {
  const isExists = await Admin.findOne({ _id: userId });
  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
  return isExists;
};

const updateAdminProfile = async (
  userId: string,
  updatedData: Partial<IAdmin>
): Promise<IAdmin | null> => {
  // check if the user exists or not
  const isExist = await Admin.findOne({ _id: userId });

  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access !');
  }

  const { name, password, ...userData } = updatedData;

  const updatedUserData: Partial<IAdmin> = { ...userData };

  // dynamically handling user name object
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
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

  const result = await Admin.findOneAndUpdate(
    { _id: userId },
    updatedUserData,
    {
      new: true,
    }
  );

  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};
