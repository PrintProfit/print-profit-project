// @ts-check
import { z } from 'zod';
import { Serial } from './base.js';

const WithId = z.object({
  id: Serial,
});

// Repeated data types
const UFloat = z.coerce.number().nonnegative().finite().safe();
const UInt = z.coerce.number().int().nonnegative();
// Names could be included, but they aren't inherently the exact same type

// A lot more of this can be null than I would have thought.

const BaseCost = z.object({
  name: z.string().trim().min(1).max(100),
  value: UFloat,
});

const BaseProduct = z.object({
  name: z.string().trim().min(1).max(100),
  quantity: UInt.optional(),
  selling_price_per_unit: UFloat.optional(),
  total_selling_price: UFloat.optional(),
  estimated_hours: UInt.optional(),
});

const BaseQuote = z.object({
  name: z.string().trim().min(1).max(100),
  manual_contribution_percent: UInt.max(100).optional(),
  manual_total_selling_price: UFloat.optional(),
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
