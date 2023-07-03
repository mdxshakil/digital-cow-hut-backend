import { z } from 'zod';
import { adminRoles } from './admin.constants';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required!',
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
    address: z.string({
      required_error: 'Address is required',
    }),
    role: z.enum([...adminRoles] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
  }),
});

const adminLoginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export const adminValidation = {
  createAdminZodSchema,
  adminLoginZodSchema,
};
