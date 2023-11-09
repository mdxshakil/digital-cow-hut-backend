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

  //make an order data to db with paymentStatus false
  await Order.create({ ...orderData, transactionId, paymentStatus: false });

  return { redirectURL: GatewayPageURL };
};

const successPayment = async (transactionId: string, res: Response) => {
  const result = await Order.updateOne(
    { transactionId: transactionId },
    {
      paymentStatus: true,
    }
  );
  //retrive the cow id from order data and change cow label to sold out
  if (result.modifiedCount > 0) {
    const orderData = await Order.findOne({ transactionId });
    await Cow.updateOne(
      { _id: orderData?.cow },
      {
        label: 'sold out',
      }
    );
  }
  // finally redirect user to payment success page
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
    const convertedUserId = new ObjectId(userId);
    const orders = await Cow.aggregate([
      {
        $match: {
          seller: convertedUserId,
          label: 'sold out',
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'cow',
          as: 'matchingOrders',
        },
      },
      {
        $unwind: '$matchingOrders',
      },
      {
        $replaceRoot: {
          newRoot: '$matchingOrders',
        },
      },
      //extra steps
    ]);
    // Populate the cow and buyer fields
    await Order.populate(orders, { path: 'cow', populate: { path: 'seller' } });
    await Order.populate(orders, { path: 'buyer' });
    return orders;
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

export const OrderService = {
  placeOrder,
  getAllOrders,
  getSingleOrder,
  successPayment,
  failedPayment,
};
