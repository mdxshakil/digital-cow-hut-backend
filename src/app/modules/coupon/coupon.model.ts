import { Schema, model } from 'mongoose';
import { IUser } from '../auth/auth.interface';

export type ICoupon = {
  couponCode: string;
  discountAmount: number;
  couponStock: number;
  usedBy: IUser[];
};

const couponSchema = new Schema<ICoupon>(
  {
    couponCode: {
      type: String,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    couponStock: {
      type: Number,
      required: true,
    },
    usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

export const Coupon = model<ICoupon>('coupon', couponSchema);
