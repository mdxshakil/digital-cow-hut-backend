/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { Coupon, ICoupon } from './coupon.model';

const createCoupon = async (data: ICoupon) => {
  const res = await Coupon.create(data);
  return res;
};

const getAllCoupon = async () => {
  const res = await Coupon.find().select('-usedBy');
  return res;
};

const claimCoupon = async (couponId: string, userId: string) => {
  const coupon = await Coupon.findById({ _id: couponId });
  if (!coupon) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon not found!');
  }
  if (coupon.usedBy.includes(userId)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'You have already claimed this coupon!'
    );
  }
  // @ts-ignore
  coupon.usedBy.push(userId);
  await coupon.save();

  return { message: 'Coupon claimed successfully!' };
};

const deleteCoupon = async (couponId: string) => {
  const res = await Coupon.deleteOne({ _id: couponId });
  return res;
};

const getMyCoupons = async (userId: string) => {
  const res = await Coupon.find({ usedBy: userId }).select({
    usedBy: 0,
    couponStock: 0,
  });
  return res;
};

export const CouponService = {
  createCoupon,
  getAllCoupon,
  claimCoupon,
  deleteCoupon,
  getMyCoupons,
};
