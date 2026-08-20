import { Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { handleImageError } from "../utils/handleImageError";
import type { Product } from "../features/cart/cartSlice";

interface ProductCardProps {
  product: Product;
  onAdded?: (title: string) => void;
}

/**
 * Displays a single product as a Bootstrap card: image, title, category,
 * rating, price, and an "Add to Cart" button. The image and title link
 * to the product's detail page. Calls the optional onAdded callback
 * after successfully adding the product to the cart, so parent
 * components can show feedback (e.g. a toast notification).
 */
function ProductCard({ product, onAdded }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    onAdded?.(product.title);
  };

  return (
    <div className="card product-card h-100">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          className="card-img-top p-3"
          style={{ height: "200px", objectFit: "contain" }}
          alt={product.title}
          onError={(e) => handleImageError(e, "300x300")}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link
          to={`/product/${product.id}`}
          className="text-decoration-none text-reset"
        >
          <h5 className="card-title">{product.title}</h5>
        </Link>
        <p className="card-text text-muted">{product.category}</p>
        <p className="card-text small text-muted">
          ★ {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
        </p>
        <p className="card-text">
          <span className="price-tag">${product.price.toFixed(2)}</span>
        </p>
        <button className="btn btn-brand mt-auto" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
