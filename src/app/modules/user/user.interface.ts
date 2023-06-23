import { Model, Types } from 'mongoose';

export type IUserRole = 'buyer' | 'seller';

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUser = {
  _id?: Types.ObjectId;
  phoneNumber: string;
  role: IUserRole;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget?: number;
  income?: number;
};

export type IUserMethods = {
  // eslint-disable-next-line no-unused-vars
  isUserExists(phoneNumber: string): Promise<Partial<IUser> | null>;
  isPasswordMatched(
    // eslint-disable-next-line no-unused-vars
    givenPassword: string,
    // eslint-disable-next-line no-unused-vars
    savedPassword: string
  ): Promise<boolean>;
};
