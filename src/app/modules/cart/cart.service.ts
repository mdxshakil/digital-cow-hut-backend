import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { ICart } from './cart.interface';
import { Cart } from './cart.model';

const addToCart = async (payload: ICart) => {
  const isExists = await Cart.findOne({
    cowId: payload.cowId,
    buyerId: payload.buyerId,
  });
  if (isExists) {
    throw new ApiError(httpStatus.CONFLICT, 'Already added to cart');
  }
  const result = await Cart.create(payload);
  return result;
};

const getMyCart = async (buyerId: string) => {
  const result = await Cart.find({
    buyerId,
  }).populate('cowId');
  return result;
};

const deleteCartItem = async (cartItemId: string) => {
  const result = await Cart.deleteOne({ _id: cartItemId });

  return result;
};

export const CartService = {
  addToCart,
  getMyCart,
  deleteCartItem,
};
