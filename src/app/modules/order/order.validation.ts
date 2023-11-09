import { z } from 'zod';

const placeOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'Cow id is required',
    }),
    buyer: z.string({
      required_error: 'Buyer id is required',
    }),
    shippingAddress: z.string({
      required_error: 'Shipping address is required',
    }),
    contactNo: z.string({
      required_error: 'Contact No. is required',
    }),
  }),
});

export const orderValidation = {
  placeOrderZodSchema,
};
