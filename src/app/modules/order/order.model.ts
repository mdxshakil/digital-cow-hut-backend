import { model, Schema } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, OrderModel>({
  cow: {
    type: Schema.Types.ObjectId,
    ref: 'Cow',
    required: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
});

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
