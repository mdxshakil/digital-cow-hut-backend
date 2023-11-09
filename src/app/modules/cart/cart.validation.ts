import { z } from 'zod';

const addToCart = z.object({
  body: z.object({
    cowId: z.string({
      required_error: 'Cow id is required',
    }),
    buyerId: z.string({
      required_error: 'Buyer id is required',
    }),
  }),
});

export const CartValidation = {
  addToCart,
};
