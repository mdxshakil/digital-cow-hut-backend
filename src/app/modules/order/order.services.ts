/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
// @ts-ignore
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../../config';
import { sslData } from '../../../constants/ssl';
import ApiError from '../../../errors/apiError';
import { Cart } from '../cart/cart.model';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
const ObjectId = mongoose.Types.ObjectId;

const placeOrder = async (orderData: IOrder) => {
  const selectedCow = await Cow.findOne({ _id: orderData.cow });
  const buyer = await User.findOne({ _id: orderData.buyer });
  const transactionId = new ObjectId().toString();

  const data = sslData(selectedCow, transactionId, buyer, orderData);
  const sslcz = new SSLCommerzPayment(
    config.ssl.storeId,
    config.ssl.storePass,
    false
  );
  const apiResponse = await sslcz.init(data);
  const GatewayPageURL = await apiResponse.GatewayPageURL;

  //make an order data to db with payment and delivery status false
  await Order.create({
    ...orderData,
    seller: selectedCow?.seller,
    transactionId,
    paymentStatus: false,
    isDelivered: false,
  });

  return { redirectURL: GatewayPageURL };
};

const successPayment = async (transactionId: string, res: Response) => {
  //update the order status
  const result = await Order.updateOne(
    { transactionId: transactionId },
    {
      paymentStatus: true,
    }
  );

  // Retrieve the order , buyer and cow data
  const orderData = await Order.findOne({ transactionId });
  const buyer = await User.findById({ _id: orderData?.buyer });
  const seller = await User.findById({ _id: orderData?.seller });
  const cow = await Cow.findById({ _id: orderData?.cow });

  // If the order status was successfully updated then update the cow's label to 'sold out'
  if (result.modifiedCount > 0 && orderData) {
    await Cow.updateOne(
      { _id: cow?._id },
      {
        label: 'sold out',
      }
    );
    // Update the seller's income
    if (
      seller &&
      seller.income !== undefined &&
      cow &&
      cow.price !== undefined
    ) {
      const updatedIncome = seller?.income + cow?.price;
      await User.updateOne(
        { _id: seller?._id },
        {
          income: updatedIncome,
        }
      );
    }
    // Remove item from buyers cart (if available)
    await Cart.deleteOne({
      buyerId: buyer?._id,
      cowId: cow?._id,
    });
  }

  // Finally, redirect the user to the payment success page
  res.redirect(`${config.client_base_url}/payment/success/${transactionId}`);
};

const failedPayment = async (transactionId: string, res: Response) => {
  await Order.deleteOne({ transactionId: transactionId });
  // redirect user to payment failed page
  res.redirect(`${config.client_base_url}/payment/fail`);
};

const getAllOrders = async (
  userId: string,
  role: string
): Promise<IOrder[] | null> => {
  if (role === 'admin') {
    return await Order.find()
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
  } else if (role === 'buyer') {
    return await Order.find({ buyer: userId })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
  } else if (role === 'seller') {
    return await Order.find({ seller: userId })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
};

const getSingleOrder = async (
  userId: string,
  role: string,
  orderId: string
): Promise<IOrder | null> => {
  //check if the order exists or not
  const selectedOrder = await Order.findOne({ _id: orderId });

  if (!selectedOrder) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No order data found with this id'
    );
  }
  const cowOfSelectedOrder = await Cow.findOne({ _id: selectedOrder?.cow });

  //return order data according to user role and userId
  if (role === 'admin') {
    return (await selectedOrder.populate('cow')).populate('buyer');
  } else if (role === 'buyer' && selectedOrder?.buyer.toString() === userId) {
    return (await selectedOrder.populate('cow')).populate('buyer');
  } else if (
    role === 'seller' &&
    cowOfSelectedOrder?.seller.toString() === userId
  ) {
    return (await selectedOrder.populate('cow')).populate('buyer');
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }
};

const getOrderByTransactionId = async (
  transactionId: string
): Promise<IOrder | null> => {
  const result = await Order.findOne({ transactionId }).populate('cow');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid transaction ID');
  }

  return result;
};

export const OrderService = {
  placeOrder,
  getAllOrders,
  getSingleOrder,
  successPayment,
  failedPayment,
  getOrderByTransactionId,
};
