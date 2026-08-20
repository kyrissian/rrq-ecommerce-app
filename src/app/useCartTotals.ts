import { useAppSelector } from "./hooks";

/**
 * Derives the total item count and total price from the current
 * cart state. Centralized here so Navbar, Cart, and any future
 * component all compute these the same way.
 */
export function useCartTotals() {
  const items = useAppSelector((state) => state.cart.items);

  const totalItems = items.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  return { items, totalItems, totalPrice };
}
