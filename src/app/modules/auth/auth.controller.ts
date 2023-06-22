import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './auth.interface';
import { AuthService } from './auth.services';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await AuthService.createUser(userData);
  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User created successfully',
    data: result,
  });
});

export const AuthController = {
  createUser,
};
