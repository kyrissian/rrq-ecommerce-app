import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductsByCategory,
} from "../api/products";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";

/**
 * Home page displaying the product catalog fetched from FakeStoreAPI.
 * Supports filtering products by category via a dropdown, and uses
 * React Query to handle fetching, loading, and error states for both
 * the product list and the category list.
 */
function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const dispatch = useAppDispatch();
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

  return (
    <div className="container mt-4">
      <h1>Products</h1>

      <div className="mb-4" style={{ maxWidth: "300px" }}>
        <label htmlFor="category-select" className="form-label">
          Filter by category
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

      <div className="row">
        {products?.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
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
                <p className="card-text fw-bold">${product.price}</p>
                <button
                  className="btn btn-primary mt-auto"
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
