import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/products";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { handleImageError } from "../utils/handleImageError";

/**
 * Product detail page showing a single product's full information,
 * looked up by its id from the URL. Uses React Query to fetch the
 * product and allows adding it directly to the cart.
 */
function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: Boolean(id),
  });

  const dispatch = useAppDispatch();

  if (isLoading) {
    return <p className="container mt-4">Loading product...</p>;
  }

  if (isError || !product) {
    return (
      <div className="container mt-4">
        <p>Sorry, we couldn't find that product.</p>
        <Link to="/">Back to all products</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Link to="/" className="d-inline-block mb-3">
        &larr; Back to products
      </Link>
      <div className="row">
        <div className="col-md-5">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid p-4"
            style={{ maxHeight: "400px", objectFit: "contain" }}
            onError={(e) => handleImageError(e, "400x400")}
          />
        </div>
        <div className="col-md-7">
          <h1>{product.title}</h1>
          <p className="text-muted">{product.category}</p>
          <p className="small text-muted">
            ★ {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
          </p>
          <p className="fs-4">
            <span className="price-tag">${product.price.toFixed(2)}</span>
          </p>
          <p>{product.description}</p>
          <button
            className="btn btn-brand"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
