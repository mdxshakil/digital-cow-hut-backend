import { z } from 'zod';
import { cowBreed, cowCategory, cowLabel, cowLocation } from './cow.constant';

const postCowZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Cow name is required!',
    }),
    age: z.number({
      required_error: 'Age is required!',
    }),
    price: z.number({
      required_error: 'Price is required!',
    }),
    location: z.enum([...cowLocation] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    breed: z.enum([...cowBreed] as [string, ...string[]], {
      required_error: 'Breed is required',
    }),
    weight: z.number({
      required_error: 'Weight is required!',
    }),
    label: z.enum([...cowLabel] as [string, ...string[]], {
      required_error: 'Label is required',
    }),
    category: z.enum([...cowCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    seller: z.string({
      required_error: 'Cow seller is required!',
    }),
  }),
});

export const cowValidation = {
  postCowZodSchema,
};
