import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin, ILoginAdminResponse } from './admin.interface';
import { AdminService } from './admin.services';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminData = req.body;
    const result = await AdminService.createAdmin(adminData);
    sendResponse<IAdmin>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'New admin created successfully',
      data: result,
    });
  }
);

const loginAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminLoginData = req.body;
    const result = await AdminService.loginAdmin(adminLoginData);

    if (!result?.accessToken || !result?.refreshToken) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login failed');
    }
    const { refreshToken, ...others } = result;

    const cookieOptions = {
      secure: config.env === 'production' ? true : false,
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<ILoginAdminResponse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      data: others,
    });
  }
);

const getAdminProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = req.user?.userId;
    const result = await AdminService.getAdminProfile(adminId);

    sendResponse<IAdmin>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Admin profile info retrived successfully',
      data: result,
    });
  }
);

const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const updatedData = req.body;
  const result = await AdminService.updateAdminProfile(userId, updatedData);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin's information updated successfully",
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};
