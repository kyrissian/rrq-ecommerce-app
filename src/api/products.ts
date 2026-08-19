import type { Product } from "../features/cart/cartSlice";

const BASE_URL = "https://fakestoreapi.com";

/**
 * Fetches every product from the FakeStoreAPI.
 *
 * @returns A promise resolving to an array of all products in the store.
 * @throws Error if the network request fails or returns a non-OK status.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}
