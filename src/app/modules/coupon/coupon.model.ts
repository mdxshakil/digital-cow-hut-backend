import { Schema, model } from 'mongoose';

export type ICoupon = {
  couponCode: string;
  discountAmount: number;
  couponStock: number;
  usedBy: string;
};

const couponSchema = new Schema<ICoupon>(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
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
