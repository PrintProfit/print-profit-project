// @ts-check
import { z } from 'zod';
import { Serial } from './base.js';

const WithId = z.object({
  id: Serial,
});

// A lot more of this can be null than I would have thought.

const BaseCost = z.object({
  name: z.string().trim().min(1).max(100),
  value: z.coerce.number().nonnegative().finite().safe(),
});

const BaseProduct = z.object({
  name: z.string().trim().min(1).max(100),
  quantity: z.coerce.number().int().nonnegative().optional(),
  selling_price_per_unit: z.coerce
    .number()
    .nonnegative()
    .finite()
    .safe()
    .optional(),
  total_selling_price: z.coerce
    .number()
    .nonnegative()
    .finite()
    .safe()
    .optional(),
  estimated_hours: z.coerce.number().int().nonnegative().optional(),
});

const BaseQuote = z.object({
  name: z.string().trim().max(100).min(1),
  manual_contribution_percent: z.coerce
    .number()
    .int()
    .nonnegative()
    .max(100)
    .optional(),
  manual_total_selling_price: z.coerce
    .number()
    .nonnegative()
    .finite()
    .safe()
    .optional(),
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
