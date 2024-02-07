// @ts-check
import { z } from 'zod';

const WithId = z.object({
  id: z.coerce.number().positive().int(),
});

const BaseCost = z.object({
  name: z.string(),
  value: z.coerce.number(),
});

const BaseProduct = z.object({
  name: z.string(),
  quantity: z.coerce.number(),
  selling_price_per_unit: z.coerce.number(),
  total_selling_price: z.coerce.number().optional(),
  estimated_hours: z.coerce.number(),
});

const BaseQuote = z.object({
  name: z.string(),
  manual_contribution_percent: z.coerce.number().optional(),
  manual_total_selling_price: z.coerce.number().optional(),
});

// This is done via merging so update routes can also construct a schema.
export const SaveQuoteBody = BaseQuote.merge(
  z.object({
    products: z.array(
      BaseProduct.merge(
        z.object({
          costs: z.array(BaseCost),
        }),
      ),
    ),
  }),
);
