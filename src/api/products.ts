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

/**
 * Fetches the list of all available product categories from the FakeStoreAPI.
 *
 * @returns A promise resolving to an array of category name strings.
 * @throws Error if the network request fails or returns a non-OK status.
 */
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches all products belonging to a specific category.
 *
 * @param category - The category name to filter products by.
 * @returns A promise resolving to an array of products in that category.
 * @throws Error if the network request fails or returns a non-OK status.
 */
export async function fetchProductsByCategory(
  category: string,
): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products/category/${category}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products for category: ${category}`);
  }

  return response.json();
}
