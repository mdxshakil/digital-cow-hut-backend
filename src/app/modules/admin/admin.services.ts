import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { jwtHelper } from '../../../shared/jwtHelper';
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  const createdAdmin = await Admin.create(adminData);
  return createdAdmin;
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
      adminId: _id,
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

export const AdminService = {
  createAdmin,
  loginAdmin,
};
