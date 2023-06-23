import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { IRefreshTokenResponse } from '../../../interfaces/token';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IUser } from './auth.interface';
import { AuthService } from './auth.services';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.body;
    const result = await AuthService.createUser(userData);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userLoginData = req.body;
    const result = await AuthService.loginUser(userLoginData);

    if (!result?.accessToken || !result?.refreshToken) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login failed');
    }
    const { refreshToken, ...others } = result;

    const cookieOptions = {
      secure: config.env === 'production' ? true : false,
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      data: others,
    });
  }
);

const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);
    const cookieOptions = {
      secure: config.env === 'production' ? true : false,
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'New access token generated successfully !',
      data: result,
    });
  }
);

export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
};
