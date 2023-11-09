import { z } from 'zod';
import { userRole } from './auth.constant';

const createUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required!',
    }),
    profilePicture: z.string({
      required_error: 'Profile Picture is required',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    role: z.enum([...userRole] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

const userLoginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export const authValidation = {
  createUserZodSchema,
  userLoginZodSchema,
};
