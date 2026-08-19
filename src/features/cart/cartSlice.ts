import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Shape of a single product as returned by the FakeStoreAPI.
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * A product that has been added to the cart, along with how many
 * of that product the user currently has in their cart.
 */
export interface CartItem extends Product {
  count: number;
}

/**
 * Shape of the cart slice's state.
 */
interface CartState {
  items: CartItem[];
}

/**
 * The cart starts out empty every time the app first loads,
 * before we hydrate it from sessionStorage (we'll wire that up later).
 */
const initialState: CartState = {
  items: [],
};

/**
 * Redux Toolkit slice that manages all shopping cart state:
 * adding products, removing products, and clearing the cart at checkout.
 */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Adds a product to the cart. If the product is already in the cart,
     * increments its count instead of adding a duplicate entry.
     */
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.count += 1;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
    },

    /**
     * Removes a product from the cart completely, regardless of its count.
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    /**
     * Empties the entire cart. Used when the user completes checkout.
     */
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
