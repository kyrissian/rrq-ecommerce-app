import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductsByCategory,
} from "../api/products";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { handleImageError } from "../utils/handleImageError";

type SortOrder =
  | ""
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating-desc";

/**
 * Home page displaying the product catalog fetched from FakeStoreAPI.
 * Supports filtering products by category and sorting by price, name,
 * or rating, and uses React Query to handle fetching, loading, and
 * error states.
 */
function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");
  const dispatch = useAppDispatch();

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

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>;
  }

  const sortedProducts = products
    ? [...products].sort((a, b) => {
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
      })
    : [];

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
        <h1 className="mb-0">Products</h1>

        <div className="d-flex flex-wrap gap-3">
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
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
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
              <div className="card product-card h-100">
                <img
                  src={product.image}
                  className="card-img-top p-3"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt={product.title}
                  onError={(e) => handleImageError(e, "300x300")}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text text-muted">{product.category}</p>
                  <p className="card-text small text-muted">
                    ★ {product.rating.rate.toFixed(1)} ({product.rating.count}{" "}
                    reviews)
                  </p>
                  <p className="card-text">
                    <span className="price-tag">
                      ${product.price.toFixed(2)}
                    </span>
                  </p>
                  <button
                    className="btn btn-brand mt-auto"
                    onClick={() => dispatch(addToCart(product))}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
