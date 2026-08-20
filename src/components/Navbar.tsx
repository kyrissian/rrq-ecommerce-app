import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

/**
 * Site navigation bar shown on every page. Displays a live badge on
 * the cart icon reflecting the total number of items currently in
 * the shopping cart.
 */
function Navbar() {
  const items = useAppSelector((state) => state.cart.items);
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <nav className="app-navbar navbar navbar-expand px-4 py-3">
      <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fs-3" to="/">
          The Daily Haul
        </Link>

        <div className="d-flex align-items-center gap-4">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link cart-link" to="/cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
