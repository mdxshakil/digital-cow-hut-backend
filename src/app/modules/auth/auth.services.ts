import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { jwtHelper } from '../../../shared/jwtHelper';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse, IUser } from './auth.interface';

const createUser = async (userData: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(userData);
  return createdUser;
};

const loginUser = async (
  userLoginData: ILoginUser
): Promise<ILoginUserResponse | null> => {
  const { phoneNumber, password } = userLoginData;

  const user = new User();
  const isUserExists = await user.isUserExists(phoneNumber);
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists!');
  }
  //match password
  if (
    isUserExists?.password &&
    !(await user.isPasswordMatched(password, isUserExists?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //create access token and refresh token
  const { _id, role } = isUserExists;
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

export const AuthService = {
  createUser,
  loginUser,
};
