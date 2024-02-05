// @ts-check

/**
 * Sample quote with some intentional bad data to stress test the code a bit.
 * @type {import("./data-types").Quote}
 */
export const quote = {
  name: 'Sample Quote',
  manual_contribution_percent: 40,
  manual_total_selling_price: 3000,
  pricePerItem: 6800,
  products: [
    {
      name: 'Order Item 1',
      quantity: 100,
      selling_price_per_unit: 14.0,
      estimated_hours: 4,
      costs: [
        { name: 'garment', value: 625 },
        { name: 'ink', value: 0 },
        { name: 'click', value: 0 },
        { name: 'outsource', value: 0 },
        { name: 'shipping', value: 0 },
        { name: 'sales commission', value: 0 },
        { name: 'transfers', value: 0 },
      ],
    },
    {
      name: 'Order Item 2',
      quantity: 100,
      selling_price_per_unit: 19.0,
      total_selling_price: 1900,
      estimated_hours: 6,
      costs: [
        { name: 'garment', value: 800 },
        { name: 'ink', value: 0 },
        { name: 'click', value: 0 },
        { name: 'outsource', value: 0 },
        { name: 'shipping', value: 0 },
        { name: 'sales commission', value: 0 },
        { name: 'transfers', value: 0 },
      ],
    },
    {
      name: 'Order Item 3',
      quantity: 100,
      selling_price_per_unit: 35.0,
      total_selling_price: 3500,
      estimated_hours: 6,
      costs: [
        { name: 'garment', value: 2000 },
        { name: 'jimmy', value: 7 },
      ],
    },
  ],
};

/**
 * @type {import("./data-types").Quote}
 */
export const emptyQuote = {
  name: '',
  products: [],
};

/**
 * @type {import("./data-types").Quote}
 */
export const initialQuote = {
  name: '',
  products: [
    {
      name: 'Item 1',
      quantity: 0,
      selling_price_per_unit: 0,
      estimated_hours: 0,
      costs: [],
    },
    {
      name: 'Item 2',
      quantity: 0,
      selling_price_per_unit: 0,
      estimated_hours: 0,
      costs: [],
    },
    {
      name: 'Item 3',
      quantity: 0,
      selling_price_per_unit: 0,
      estimated_hours: 0,
      costs: [],
    },
  ],
};
