import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin } from './admin.interface';
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

export const AdminController = {
  createAdmin,
};
