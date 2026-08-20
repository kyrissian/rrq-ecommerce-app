import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { useCartTotals } from "../app/useCartTotals";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../features/cart/cartSlice";
import { handleImageError } from "../utils/handleImageError";

/**
 * Cart page displaying all items currently in the shopping cart,
 * their quantities and prices, running totals, and controls to
 * adjust quantities, remove individual items, or complete checkout
 * (which simulates a purchase by clearing the cart and showing a
 * confirmation message). Item images and titles link to each
 * product's detail page.
 */
function Cart() {
  const { items, totalItems, totalPrice } = useCartTotals();
  const dispatch = useAppDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Simulates a checkout by clearing the cart and briefly showing
   * a success message to confirm the action to the user.
   */
  const handleCheckout = () => {
    dispatch(clearCart());
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <div className="container mt-4">
      <h1>Shopping Cart</h1>

      {showConfirmation && (
        <div className="alert alert-success" role="alert">
          Checkout successful! Your cart has been cleared.
        </div>
      )}

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="d-flex align-items-center cart-divider py-3"
            >
              <Link to={`/product/${item.id}`} className="me-3">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                  onError={(e) => handleImageError(e, "60x60")}
                />
              </Link>
              <div className="flex-grow-1">
                <Link
                  to={`/product/${item.id}`}
                  className="text-decoration-none text-reset"
                >
                  <p className="mb-1">{item.title}</p>
                </Link>
                <p className="mb-0 text-muted receipt-total">
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 me-3">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    dispatch(
                      updateQuantity({ id: item.id, count: item.count - 1 }),
                    )
                  }
                  aria-label={`Decrease quantity of ${item.title}`}
                >
                  −
                </button>
                <span
                  className="receipt-total"
                  style={{ minWidth: "1.5rem", textAlign: "center" }}
                >
                  {item.count}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    dispatch(
                      updateQuantity({ id: item.id, count: item.count + 1 }),
                    )
                  }
                  aria-label={`Increase quantity of ${item.title}`}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-remove btn-sm"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4">
            <p className="fs-5">Total items: {totalItems}</p>
            <p className="fs-5 fw-bold receipt-total">
              Total price: ${totalPrice.toFixed(2)}
            </p>
            <button className="btn btn-brand" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
