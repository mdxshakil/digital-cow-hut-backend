import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CartService } from './cart.service';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const cartData = req.body;
  const result = await CartService.addToCart(cartData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Added to cart successfully',
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const { buyerId } = req.params;
  const result = await CartService.getMyCart(buyerId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cart retrived successfully',
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const { cartItemId } = req.params;
  const result = await CartService.deleteCartItem(cartItemId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cart item deleted successfully',
    data: result,
  });
});

export const CartController = {
  addToCart,
  getMyCart,
  deleteCartItem,
};
