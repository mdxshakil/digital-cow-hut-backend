import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import zodGuard from '../../middlewares/validateRequest';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';
const router = express.Router();

router.post(
  '/',
  zodGuard(CouponValidation.createCoupon),
  authGuard(UserRole.ADMIN),
  CouponController.createCoupon
);

router.get('/', CouponController.getAllCoupon);

router.post(
  '/:couponId',
  authGuard(UserRole.BUYER),
  CouponController.claimCoupon
);

router.delete(
  '/:couponId',
  authGuard(UserRole.ADMIN),
  CouponController.deleteCoupon
);

router.get(
  '/:userId',
  authGuard(UserRole.BUYER),
  CouponController.getMyCoupons
);

export const Couponroutes = router;
