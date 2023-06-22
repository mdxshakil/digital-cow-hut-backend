import { Schema, model } from 'mongoose';
import { userRole } from './user.constant';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: userRole,
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
    budget: {
      type: Number,
    },
    income: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//set default income and budget values for users
userSchema.pre('save', async function (next) {
  if (this.role === 'buyer') {
    if (!this.budget) {
      this.budget = 0;
    }
    this.income = 0;
  }
  if (this.role === 'seller') {
    this.budget = 0;
    this.income = 0;
  }
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
