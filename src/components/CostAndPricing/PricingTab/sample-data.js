// @ts-check

/** @type {import("./data-types").Quote} */
export const quote = {
  name: 'Sample Quote',
  contributionPercent: 0.4,
  manualPrice: 3000,
  pricePerItem: 6800,
  products: [
    {
      name: 'Order Item 1',
      quantity: 100,
      selling_price: 14.0,
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
      selling_price: 19.0,
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
      selling_price: 35.0,
      total_selling_price: 3500,
      estimated_hours: 6,
      costs: [
        { name: 'garment', value: 2000 },
        { name: 'ink', value: 0 },
        { name: 'click', value: 0 },
        { name: 'outsource', value: 0 },
        { name: 'shipping', value: 0 },
        { name: 'sales commission', value: 0 },
        { name: 'transfers', value: 0 },
      ],
    },
  ],
};
