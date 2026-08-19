import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

/**
 * The central Redux store for the application. Currently manages
 * the shopping cart slice; additional slices can be added here
 * as the app grows.
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

/**
 * Type representing the entire Redux state tree, inferred directly
 * from the store itself so it always stays accurate.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type representing the store's dispatch function, used so components
 * get proper typing when dispatching actions (including thunks).
 */
export type AppDispatch = typeof store.dispatch;
