import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { jwtHelper } from '../../../shared/jwtHelper';
import { User } from '../user/user.model';
import { ILoginUser, IUser } from './auth.interface';

const createUser = async (userData: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(userData);
  if (!createdUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }
  const createdNewUser = await User.findOne({ _id: createdUser._id });
  return createdNewUser;
};

const loginUser = async (userLoginData: ILoginUser) => {
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

  //create access token
  const { _id, role } = isUserExists;
  const accessToken = jwtHelper.createToken(
    {
      userId: _id,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const userProfile = await User.findOne({ phoneNumber });

  return {
    accessToken,
    user: {
      userId: userProfile?._id,
      phoneNumber: userProfile?.phoneNumber,
      role: userProfile?.role,
      profilePicture: userProfile?.profilePicture,
      name: {
        firstName: userProfile?.name.firstName,
        lastName: userProfile?.name.lastName,
      },
    },
  };
};

const persistLogin = async (userId: string) => {
  const userProfile = await User.findOne({ _id: userId });

  return {
    user: {
      userId: userProfile?._id,
      phoneNumber: userProfile?.phoneNumber,
      role: userProfile?.role,
      profilePicture: userProfile?.profilePicture,
      name: {
        firstName: userProfile?.name.firstName,
        lastName: userProfile?.name.lastName,
      },
    },
  };
};

export const AuthService = {
  createUser,
  loginUser,
  persistLogin,
};
