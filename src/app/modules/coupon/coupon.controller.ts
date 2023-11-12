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

const getAllCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getAllCoupon();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupons retrived successfully',
    data: result,
  });
});

const claimCoupon = catchAsync(async (req: Request, res: Response) => {
  const { couponId } = req.params;
  const { userId } = req.body;

  const result = await CouponService.claimCoupon(couponId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupons claimed successfully',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { couponId } = req.params;

  const result = await CouponService.deleteCoupon(couponId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

const getMyCoupons = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await CouponService.getMyCoupons(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupons retrived successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupon,
  claimCoupon,
  deleteCoupon,
  getMyCoupons,
};
