import { Model, Types } from 'mongoose';
import { IUser } from '../auth/auth.interface';
import { ICow } from '../cow/cow.interface';

export type ICart = {
  buyerId: Types.ObjectId | IUser;
  cowId: Types.ObjectId | ICow;
};

export type CartModel = Model<ICart, Record<string, unknown>>;
