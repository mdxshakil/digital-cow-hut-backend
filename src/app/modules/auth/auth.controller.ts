import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './auth.interface';
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

    if (!result?.accessToken) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login failed');
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      data: result,
    });
  }
);

const persistLogin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.persistLogin(req?.user?.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      data: result,
    });
  }
);

export const AuthController = {
  createUser,
  loginUser,
  persistLogin,
};
