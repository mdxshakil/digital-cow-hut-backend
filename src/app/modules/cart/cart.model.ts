import { model, Schema } from 'mongoose';
import { CartModel, ICart } from './cart.interface';

const cartSchema = new Schema<ICart, CartModel>({
  cowId: {
    type: Schema.Types.ObjectId,
    ref: 'Cow',
    required: true,
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Cart = model<ICart, CartModel>('Cart', cartSchema);
