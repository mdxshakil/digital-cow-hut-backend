import { z } from 'zod';

const createCoupon = z.object({
  body: z.object({
    couponCode: z.string({
      required_error: 'Coupon code is required',
    }),
    discountAmount: z.number({
      required_error: 'Discount amount is required',
    }),
    couponStock: z.number({
      required_error: 'Coupon stock is required',
    }),
  }),
});

export const CouponValidation = {
  createCoupon,
};
