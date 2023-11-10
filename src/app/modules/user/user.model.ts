import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { userRole } from './user.constant';
import { IUser, IUserMethods, UserModel } from './user.interface';

const userSchema = new Schema<IUser, Record<string, never>, IUserMethods>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      require: true,
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
  if (this.role === 'seller') {
    this.income = 0;
  }
  next();
});

//hash password before saving
userSchema.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  this.password = hashedPassword;
  next();
});

//check user exists or not before login
userSchema.methods.isUserExists = async function (
  phoneNumber: string
): Promise<Partial<IUser> | null> {
  const user = await User.findOne({ phoneNumber }, { password: 1, role: 1 });
  return user;
};

//check password valid or not before login
userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(givenPassword, savedPassword);
  return isMatch;
};

export const User = model<IUser, UserModel>('User', userSchema);
