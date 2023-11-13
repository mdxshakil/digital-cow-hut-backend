import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.services';

const getUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getUsers();
    sendResponse<IUser[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Users retrived successfully',
      data: result,
    });
  }
);

const getSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getSingleUser(req.params.id);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User retrived successfully',
      data: result,
    });
  }
);

const deleteSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.deleteSingleUser(req.params.id);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User deleted successfully',
      data: result,
    });
  }
);

const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const updatedData = req.body;
    const id = req.params.id;
    const result = await UserService.updateUser(id, updatedData);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User updated successfully',
      data: result,
    });
  }
);

const getMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.userId;
    const role = req?.user?.role;
    const result = await UserService.getMyProfile(userId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User's information retrieved successfully",
      data: result,
    });
  }
);

const updateMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const updatedData = req.body;
    const result = await UserService.updateMyProfile(userId, updatedData);

    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User's information retrieved successfully",
      data: result,
    });
  }
);

export const UserController = {
  getUsers,
  getSingleUser,
  deleteSingleUser,
  updateUser,
  getMyProfile,
  updateMyProfile,
};
