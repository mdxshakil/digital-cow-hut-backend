import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import { OrderController } from './order.controller';
const router = express.Router();

router.post('/', authGuard(UserRole.BUYER), OrderController.placeOrder);
router.get(
  '/',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  OrderController.getAllOrders
);

router.get(
  '/:id',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  OrderController.getSingleOrder
);

export const OrderRoutes = router;
