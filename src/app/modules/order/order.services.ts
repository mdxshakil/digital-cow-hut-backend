import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/apiError';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
const ObjectId = mongoose.Types.ObjectId;

const placeOrder = async (
  orderData: IOrder,
  userId: string
): Promise<IOrder | null> => {
  const { buyer, cow } = orderData;
  if (!buyer || !cow) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cow and buyer both id is required'
    );
  }
  //if current buyer id doesnot matches with authorized user id then throw error
  if (userId !== buyer.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized access');
  }
  const cowBuyer = await User.findById({ _id: buyer });
  const selectedCow = await Cow.findById({ _id: cow });
  const cowSeller = await User.findById({
    _id: selectedCow?.seller,
  });

  if (!cowBuyer || !selectedCow) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer or cow not found');
  }

  if (selectedCow.label === 'sold out') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This cow already has been sold out!!!!'
    );
  }

  // Check that the user has enough money in their account to buy the cow.
  if (cowBuyer?.budget && cowBuyer?.budget < selectedCow.price) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You do not have enough money to buy this cow'
    );
  }

  //   ==========Begin of transaction and rollback process==========

  let newOrderAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //   Change the cow's label from 'for sale' to 'sold out'.
    await Cow.findByIdAndUpdate(
      { _id: selectedCow._id },
      { label: 'sold out' },
      { session }
    );

    //   Deduct the cost of the cow from the buyer's budget
    const updatedBudget =
      cowBuyer?.budget && cowBuyer?.budget - selectedCow?.price;
    await User.findByIdAndUpdate(
      { _id: cowBuyer._id },
      {
        budget: updatedBudget,
      },
      { session }
    );
    // Put the same amount of cost into the seller's income
    const updatedIncome = (cowSeller?.income ?? 0) + selectedCow.price;
    await User.findByIdAndUpdate(
      { _id: cowSeller?._id },
      {
        income: updatedIncome,
      },
      { session }
    );

    //Finally create the order
    const newOrder = await Order.create([orderData], { session });
    if (!newOrder.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to place order');
    }

    //populate the final result
    newOrderAllData = await Order.findById(newOrder[0]._id)
      .populate('buyer')
      .populate('cow')
      .session(session);

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newOrderAllData;
};

const getAllOrders = async (
  userId: string,
  role: string
): Promise<IOrder[] | null> => {
  if (role === 'admin') {
    return await Order.find().populate('cow').populate('buyer');
  } else if (role === 'buyer') {
    return await Order.find({ buyer: userId })
      .populate('cow')
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
    ]);
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
};
