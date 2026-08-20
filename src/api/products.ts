import type { Product } from "../features/cart/cartSlice";

const BASE_URL = "https://fakestoreapi.com";

function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const product = raw as Partial<Product> & {
    rating?: { rate?: unknown; count?: unknown };
  };

  const id = Number(product.id);
  const price = Number(product.price);
  const rate = Number(product.rating?.rate);
  const count = Number(product.rating?.count);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return {
    id,
    title:
      typeof product.title === "string" && product.title.trim()
        ? product.title
        : "Untitled product",
    price: Number.isFinite(price) ? price : 0,
    description:
      typeof product.description === "string" && product.description.trim()
        ? product.description
        : "No description available.",
    category:
      typeof product.category === "string" && product.category.trim()
        ? product.category
        : "uncategorized",
    image:
      typeof product.image === "string" && product.image.trim()
        ? product.image
        : "https://placehold.co/300x300?text=No+Image",
    rating: {
      rate: Number.isFinite(rate) ? rate : 0,
      count: Number.isFinite(count) ? count : 0,
    },
  };
}

/**
 * Performs a fetch request and parses the JSON response, throwing
 * a descriptive error if the request fails or returns a non-OK status.
 *
 * @param url - The full URL to fetch.
 * @returns A promise resolving to the parsed JSON response.
 * @throws Error if the network request fails or the response is not OK.
 */
async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}): ${url}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to load data from ${url}. ${error.message}`, {
        cause: error,
      });
    }

    throw new Error(`Unable to load data from ${url}.`, { cause: error });
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  const products = await fetchJson<unknown[]>(`${BASE_URL}/products`);
  return products
    .map((product) => normalizeProduct(product))
    .filter((product): product is Product => product !== null);
}

export async function fetchCategories(): Promise<string[]> {
  const categories = await fetchJson<unknown[]>(
    `${BASE_URL}/products/categories`,
  );
  return categories.filter(
    (category): category is string =>
      typeof category === "string" && category.trim().length > 0,
  );
}

export async function fetchProductsByCategory(
  category: string,
): Promise<Product[]> {
  const products = await fetchJson<unknown[]>(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`,
  );
  return products
    .map((product) => normalizeProduct(product))
    .filter((product): product is Product => product !== null);
}

export async function fetchProductById(id: number): Promise<Product> {
  const product = normalizeProduct(
    await fetchJson<unknown>(`${BASE_URL}/products/${id}`),
  );

  if (!product) {
    throw new Error("Product data is missing or invalid.");
  }

  return product;
}
