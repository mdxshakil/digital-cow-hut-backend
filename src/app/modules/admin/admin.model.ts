import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { AdminModel, IAdmin, IAdminMethods } from './admin.interface';

const adminSchema = new Schema<IAdmin, Record<string, never>, IAdminMethods>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//hash password before saving
adminSchema.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  this.password = hashedPassword;
  next();
});

//check user exists or not before login
adminSchema.methods.isAdminExists = async function (
  phoneNumber: string
): Promise<Partial<IAdmin> | null> {
  const user = await Admin.findOne({ phoneNumber }, { password: 1, role: 1 });
  return user;
};

//check password valid or not before login
adminSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(givenPassword, savedPassword);
  return isMatch;
};

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
