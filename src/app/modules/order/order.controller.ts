import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.services';

const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const result = await OrderService.placeOrder(orderData);
  sendResponse<IOrder>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow purchased successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  const result = await OrderService.getAllOrders(userId, role);
  sendResponse<IOrder[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrived successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const orderId = req.params?.id;

  const result = await OrderService.getSingleOrder(userId, role, orderId);
  sendResponse<IOrder>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order information retrived successfully',
    data: result,
  });
});

export const OrderController = {
  placeOrder,
  getAllOrders,
  getSingleOrder,
};
