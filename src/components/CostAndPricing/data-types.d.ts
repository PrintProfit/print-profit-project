// I need this

interface Cost {
  name: string;
  value: number;
}

interface Product {
  name: string;
  quantity: number;
  selling_price: number;
  total_selling_price: number;
  estimated_hours: number;
  costs: Cost[];
}

interface Quote {
  name: string;
  products: Product[];
}
