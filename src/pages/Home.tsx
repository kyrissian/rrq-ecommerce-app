import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductsByCategory,
} from "../api/products";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";

type SortOrder = "" | "asc" | "desc";

/**
 * Home page displaying the product catalog fetched from FakeStoreAPI.
 * Supports filtering products by category and sorting by price, and
 * uses React Query to handle fetching, loading, and error states.
 */
function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");
  const dispatch = useAppDispatch();

  const { data: categories } = useQuery({
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
        if (sortOrder === "asc") return a.price - b.price;
        if (sortOrder === "desc") return b.price - a.price;
        return 0;
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
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-select"
              className="form-label small text-muted mb-1"
            >
              Sort by price
            </label>
            <select
              id="sort-select"
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        {sortedProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card product-card h-100">
              <img
                src={product.image}
                className="card-img-top p-3"
                style={{ height: "200px", objectFit: "contain" }}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/300x300?text=No+Image";
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-muted">{product.category}</p>
                <p className="card-text">
                  <span className="price-tag">${product.price.toFixed(2)}</span>
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
    </div>
  );
}

export default Home;
