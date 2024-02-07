// @ts-check
import { z } from 'zod';

const WithId = z.object({
  id: z.coerce.number().positive().int(),
});

// A lot more of this can be null than I would have thought.

const BaseCost = z.object({
  name: z.string().max(100),
  value: z.coerce.number().finite(),
});

const BaseProduct = z.object({
  name: z.string().max(100),
  quantity: z.coerce.number().int().optional(),
  selling_price_per_unit: z.coerce.number().finite().optional(),
  total_selling_price: z.coerce.number().finite().optional(),
  estimated_hours: z.coerce.number().int().optional(),
});

const BaseQuote = z.object({
  name: z.string().max(100),
  manual_contribution_percent: z.coerce.number().nonnegative().int().optional(),
  manual_total_selling_price: z.coerce.number().finite().optional(),
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

export const UpdateQuoteBody = BaseQuote.merge(WithId).merge(
  z.object({
    products: z.array(
      BaseProduct.merge(WithId.partial()).merge(
        z.object({
          costs: z.array(BaseCost.merge(WithId.partial())),
        }),
      ),
    ),
  }),
);
