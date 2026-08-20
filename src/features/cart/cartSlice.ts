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

const SESSION_STORAGE_KEY = "cart";

/**
 * Reads the persisted cart items out of sessionStorage, if any exist.
 * Falls back to an empty array if nothing is saved yet, if the saved
 * data is malformed JSON, or if the parsed data isn't actually an array.
 *
 * @returns The array of cart items to use as the initial cart state.
 */
function loadCartFromSessionStorage(): CartItem[] {
  try {
    const savedCart = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const parsed = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves the current cart items to sessionStorage so they persist
 * across page refreshes within the same browser tab/session. Fails
 * silently if storage is unavailable or full, since the cart still
 * works fine in-memory for the rest of the session either way.
 *
 * @param items - The current array of cart items to persist.
 */
function saveCartToSessionStorage(items: CartItem[]): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable or full — cart still works in-memory for this session.
  }
}

/**
 * The cart is hydrated from sessionStorage on load, so a page refresh
 * doesn't wipe out whatever the user had added.
 */
const initialState: CartState = {
  items: loadCartFromSessionStorage(),
};

/**
 * Redux Toolkit slice that manages all shopping cart state:
 * adding products, removing products, and clearing the cart at checkout.
 * Every change is persisted to sessionStorage automatically.
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

      saveCartToSessionStorage(state.items);
    },

    /**
     * Removes a product from the cart completely, regardless of its count.
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToSessionStorage(state.items);
    },

    /**
     * Empties the entire cart. Used when the user completes checkout.
     */
    clearCart: (state) => {
      state.items = [];
      saveCartToSessionStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
