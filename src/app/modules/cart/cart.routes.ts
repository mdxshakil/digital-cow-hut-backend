import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import zodGuard from '../../middlewares/validateRequest';
import { CartController } from './cart.controller';
import { CartValidation } from './cart.validation';
const router = express.Router();

router.post(
  '/add-to-cart',
  authGuard(UserRole.BUYER),
  zodGuard(CartValidation.addToCart),
  CartController.addToCart
);

router.get('/:buyerId', authGuard(UserRole.BUYER), CartController.getMyCart);

router.delete(
  '/:cartItemId',
  authGuard(UserRole.BUYER),
  CartController.deleteCartItem
);

export const CartRoutes = router;
