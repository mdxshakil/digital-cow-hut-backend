import { Model } from 'mongoose';

export type IUserRole = 'buyer' | 'seller';

export type IUser = {
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

export type UserModel = Model<IUser, Record<string, unknown>>;

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  phoneNumber: string;
  password: string;
};
