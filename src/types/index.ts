// Core API Response Types
export interface Store {
  id: number;
  name: string;
  country_id: number;
  country_code?: string;
  address?: string;
  phone?: string;
  is_open?: boolean;
  opening_hours?: string;
}

export interface StoresResponse {
  data: Store[];
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price_cents: number;
  image_url: string;
  description?: string;
  is_available?: boolean;
}

export interface ProductsResponse {
  data: Product[];
}

export interface Supplement {
  id?: number;
  name: string;
  price_cents?: number;
}

export interface SupplementsResponse {
  pains: Supplement[];
  frites: Supplement[];
  sauces: Supplement[];
}

export interface DeliveryZone {
  id: number;
  name: string;
  delivery_fee_cents: number;
}

export interface DeliveryZonesResponse {
  delivery_zones: DeliveryZone[];
}

// Cart Types
export interface CartItemSupplements {
  pain?: string;
  frites?: string;
  sauces?: string[];
}

export interface CartItem {
  product_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  supplements: CartItemSupplements;
  supplements_price: number;
  total_price: number;
}

// Order Types
export interface OrderItem {
  product_id: number;
  quantity: number;
  pain?: string;
  frites?: string;
  sauces?: string[];
}

export interface OrderPayload {
  store_id: number;
  customer_name: string;
  customer_phone: string;
  delivery_zone_id: number;
  note?: string;
  items: OrderItem[];
}

export interface OrderResponse {
  id: number;
  order_number: string;
  status: string;
  total_cents: number;
  created_at: string;
}

// App State Types
export interface AppState {
  storeId: number | null;
  countryCode: string | null;
  countryId: number | null;
  setStoreId: (id: number | null) => void;
  setCountryCode: (code: string | null) => void;
  setCountryId: (id: number | null) => void;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, supplements: CartItemSupplements, supplementsPrice: number) => void;
  changeQty: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  getItemsCount: () => number;
  getSubtotal: () => number;
}

// Country Types
export type CountryCode = 'SN' | 'CI';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  phonePrefix: string;
  phoneDigits: number;
  flag: string;
}
