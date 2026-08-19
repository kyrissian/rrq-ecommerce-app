import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "../api/products";

/**
 * Home page displaying the full product catalog fetched from FakeStoreAPI.
 * Uses React Query to handle fetching, loading, and error states.
 */
function Home() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
  });

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Oops! Something went wrong: {error.message}</p>;
  }

  return (
    <div className="container mt-4">
      <h1>Products</h1>
      <div className="row">
        {products?.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top p-3"
                style={{ height: "200px", objectFit: "contain" }}
                alt={product.title}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-muted">{product.category}</p>
                <p className="card-text fw-bold">${product.price}</p>
                <button className="btn btn-primary mt-auto">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
