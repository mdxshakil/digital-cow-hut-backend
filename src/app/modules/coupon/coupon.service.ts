import { Coupon, ICoupon } from './coupon.model';

const createCoupon = async (data: ICoupon) => {
  const res = await Coupon.create(data);
  return res;
};

export const CouponService = {
  createCoupon,
};
