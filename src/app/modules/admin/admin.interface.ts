import { Model, Types } from 'mongoose';

export type IAdmin = {
  _id?: Types.ObjectId;
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>, IAdminMethods>;

export type IAdminMethods = {
  // eslint-disable-next-line no-unused-vars
  isAdminExists(phoneNumber: string): Promise<Partial<IAdmin> | null>;
  isPasswordMatched(
    // eslint-disable-next-line no-unused-vars
    givenPassword: string,
    // eslint-disable-next-line no-unused-vars
    savedPassword: string
  ): Promise<boolean>;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};
