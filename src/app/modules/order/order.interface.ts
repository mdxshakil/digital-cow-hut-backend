import { Model, Types } from 'mongoose';
import { IUser } from '../auth/auth.interface';
import { ICow } from '../cow/cow.interface';

export type IOrder = {
  buyer: Types.ObjectId | IUser;
  cow: Types.ObjectId | ICow;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
