import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import zodGuard from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { orderValidation } from './order.validation';
const router = express.Router();

router.post(
  '/',
  zodGuard(orderValidation.placeOrderZodSchema),
  authGuard(UserRole.BUYER),
  OrderController.placeOrder
);
router.post('/payment-success/:transactionId', OrderController.successPayment);

router.post('/payment-failed/:transactionId', OrderController.failedPayment);

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

router.get(
  '/transaction/:transactionId',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  OrderController.getOrderByTransactionId
);

router.patch(
  '/deliver/:orderId',
  authGuard(UserRole.ADMIN),
  OrderController.deliverOrder
);

export const OrderRoutes = router;
