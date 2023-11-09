import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.services';

const placeOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const orderData = req.body;
    const result = await OrderService.placeOrder(orderData);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow purchased successfully',
      data: result,
    });
  }
);

const successPayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const result = await OrderService.successPayment(transactionId, res);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment successful',
      data: result,
    });
  }
);

const failedPayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const result = await OrderService.failedPayment(transactionId, res);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment failed',
      data: result,
    });
  }
);

const getAllOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    const result = await OrderService.getAllOrders(userId, role);
    sendResponse<IOrder[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Orders retrived successfully',
      data: result,
    });
  }
);

const getSingleOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
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
  }
);

export const OrderController = {
  placeOrder,
  successPayment,
  getAllOrders,
  getSingleOrder,
  failedPayment,
};
