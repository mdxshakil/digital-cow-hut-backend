import { Schema, model } from 'mongoose';
import { cowBreed, cowCategory, cowLabel, cowLocation } from './cow.constant';
import { CowModel, ICow } from './cow.interface';

const cowSchema = new Schema<ICow, CowModel>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: cowLocation,
      required: true,
    },
    breed: {
      type: String,
      enum: cowBreed,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: cowLabel,
      required: true,
    },
    category: {
      type: String,
      enum: cowCategory,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//change the default label of cow before saving
cowSchema.pre('save', async function (next) {
  if (this.label !== 'for sale') {
    this.label = 'for sale';
  }
  next();
});

export const Cow = model<ICow, CowModel>('Cow', cowSchema);
