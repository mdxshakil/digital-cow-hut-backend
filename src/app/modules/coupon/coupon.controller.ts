import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CouponService } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await CouponService.createCoupon(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon created successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
};
