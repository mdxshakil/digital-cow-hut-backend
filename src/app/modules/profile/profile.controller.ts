import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin } from '../admin/admin.interface';
import { IUser } from '../auth/auth.interface';
import { ProfileService } from './profile.services';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const result = await ProfileService.getMyProfile(userId, role);

  sendResponse<IUser | IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User's information retrieved successfully",
    data: result,
  });
});

export const ProfileController = {
  getMyProfile,
};
