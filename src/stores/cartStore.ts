import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem, Product, CartItemSupplements } from '../types';

const STORAGE_KEY = 'planet-kebab-cart';

// Helper to check if two items have the same supplements
const haveSameSupplements = (sup1: CartItemSupplements, sup2: CartItemSupplements): boolean => {
  if (sup1.pain !== sup2.pain) return false;
  if (sup1.frites !== sup2.frites) return false;
  
  const sauces1 = sup1.sauces || [];
  const sauces2 = sup2.sauces || [];
  
  if (sauces1.length !== sauces2.length) return false;
  
  const sorted1 = [...sauces1].sort();
  const sorted2 = [...sauces2].sort();
  
  return sorted1.every((sauce, index) => sauce === sorted2[index]);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity: number, supplements: CartItemSupplements, supplementsPrice: number) => {
        const items = get().items;
        
        // Check if item with same product and supplements already exists
        const existingIndex = items.findIndex(
          (item) => item.product_id === product.id && haveSameSupplements(item.supplements, supplements)
        );
        
        if (existingIndex >= 0) {
          // Update quantity of existing item
          const newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
            total_price: (newItems[existingIndex].quantity + quantity) * 
              (newItems[existingIndex].unit_price + newItems[existingIndex].supplements_price),
          };
          set({ items: newItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            product_id: product.id,
            name: product.name,
            unit_price: product.price_cents,
            quantity,
            supplements,
            supplements_price: supplementsPrice,
            total_price: quantity * (product.price_cents + supplementsPrice),
          };
          set({ items: [...items, newItem] });
        }
      },
      
      changeQty: (index: number, delta: number) => {
        const items = get().items;
        if (index < 0 || index >= items.length) return;
        
        const item = items[index];
        const newQuantity = item.quantity + delta;
        
        if (newQuantity <= 0) {
          // Remove item if quantity reaches 0
          get().removeItem(index);
        } else {
          // Update quantity
          const newItems = [...items];
          newItems[index] = {
            ...item,
            quantity: newQuantity,
            total_price: newQuantity * (item.unit_price + item.supplements_price),
          };
          set({ items: newItems });
        }
      },
      
      removeItem: (index: number) => {
        const items = get().items;
        const newItems = items.filter((_, i) => i !== index);
        set({ items: newItems });
      },
      
      clearCart: () => set({ items: [] }),
      
      getItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.total_price, 0);
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
