import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductsByCategory,
} from "../api/products";
import ProductCard from "../components/ProductCard";

type SortOrder =
  | ""
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating-desc";

/**
 * Home page displaying the product catalog fetched from FakeStoreAPI.
 * Supports filtering by category, searching by title, and sorting by
 * price, name, or rating. Filter/search/sort state is kept in the URL
 * query string so the current view can be refreshed, bookmarked, or
 * shared. Uses React Query to handle fetching, loading, and error
 * states, and shows a brief toast notification whenever a product is
 * added to the cart.
 */
function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedCategory = searchParams.get("category") ?? "";
  const sortOrder = (searchParams.get("sort") ?? "") as SortOrder;
  const searchQuery = searchParams.get("q") ?? "";

  /**
   * Updates a single query param while leaving the others untouched.
   * Removes the param entirely when set to an empty string, so the
   * URL stays clean (e.g. "/" instead of "/?category=&sort=").
   */
  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const { data: categories, isError: isCategoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () =>
      selectedCategory
        ? fetchProductsByCategory(selectedCategory)
        : fetchAllProducts(),
  });

  /**
   * Shows a brief toast confirming a product was added to the cart,
   * automatically hiding it after 2 seconds.
   */
  const handleAdded = (title: string) => {
    setToastMessage(`${title} added to cart`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>;
  }

  const filteredProducts = (products ?? []).filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "rating-desc":
        return b.rating.rate - a.rating.rate;
      default:
        return 0;
    }
  });

  return (
    <div className="container mt-4">
      {toastMessage && (
        <div className="alert alert-success toast-notification" role="alert">
          {toastMessage}
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
        <h1 className="mb-0">Products</h1>

        <div className="d-flex flex-wrap gap-3">
          <div>
            <label
              htmlFor="search-input"
              className="form-label small text-muted mb-1"
            >
              Search
            </label>
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => updateParam("q", e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="category-select"
              className="form-label small text-muted mb-1"
            >
              Category
            </label>
            <select
              id="category-select"
              className="form-select"
              value={selectedCategory}
              onChange={(e) => updateParam("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {isCategoriesError ? (
                <option disabled>Categories unavailable</option>
              ) : (
                categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-select"
              className="form-label small text-muted mb-1"
            >
              Sort
            </label>
            <select
              id="sort-select"
              className="form-select"
              value={sortOrder}
              onChange={(e) => updateParam("sort", e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row">
          {sortedProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <ProductCard product={product} onAdded={handleAdded} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
