import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

/**
 * Root application component. Sets up client-side routing between
 * the Home page (product catalog) and the Cart page, along with a
 * simple navigation bar for moving between them.
 */
function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="/">
          RRQ Store
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/cart">
            Cart
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
