import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useCartTotals } from "../app/useCartTotals";
import { removeFromCart, clearCart } from "../features/cart/cartSlice";
import { handleImageError } from "../utils/handleImageError";

/**
 * Cart page displaying all items currently in the shopping cart,
 * their quantities and prices, running totals, and controls to
 * remove individual items or complete checkout (which simulates
 * a purchase by clearing the cart and showing a confirmation message).
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
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
                className="me-3"
                onError={(e) => handleImageError(e, "60x60")}
              />
              <div className="flex-grow-1">
                <p className="mb-1">{item.title}</p>
                <p className="mb-0 text-muted receipt-total">
                  Qty: {item.count} × ${item.price.toFixed(2)}
                </p>
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
