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

export const Couponroutes = router;
