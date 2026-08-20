import type { Product } from "../features/cart/cartSlice";

const BASE_URL = "https://fakestoreapi.com";

/**
 * Performs a fetch request and parses the JSON response, throwing
 * a descriptive error if the request fails or returns a non-OK status.
 *
 * @param url - The full URL to fetch.
 * @returns A promise resolving to the parsed JSON response.
 * @throws Error if the network request fails or the response is not OK.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }

  return response.json();
}

export function fetchAllProducts(): Promise<Product[]> {
  return fetchJson<Product[]>(`${BASE_URL}/products`);
}

export function fetchCategories(): Promise<string[]> {
  return fetchJson<string[]>(`${BASE_URL}/products/categories`);
}

export function fetchProductsByCategory(category: string): Promise<Product[]> {
  return fetchJson<Product[]>(`${BASE_URL}/products/category/${category}`);
}

export function fetchProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}
