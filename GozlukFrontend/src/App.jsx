import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import "./App.css";
import Checkout from "./pages/Checkout";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState("products");
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    async function checkUser() {
      const savedUserId = localStorage.getItem("userId");
      if (savedUserId) {
        setUserId(parseInt(savedUserId));
        const response = await fetch(`${API_URL}/api/cart/${savedUserId}`);
        const data = await response.json();
        const total = data.reduce(function(sum, item) { return sum + item.quantity; }, 0);
        setCartCount(total);
      } else {
        setPage("login");
      }
    }
    checkUser();
  }, []);

  async function handleLogin(id) {
    localStorage.setItem("userId", id);
    setUserId(id);
    setPage("products");
    const response = await fetch(`${API_URL}/api/cart/${id}`);
    const data = await response.json();
    const total = data.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    setCartCount(total);
  }

  function handleRegister() {
    setPage("login");
  }

  async function refreshCartCount(count) {
    if (count !== undefined) {
      setCartCount(count);
    } else {
      const id = userId || localStorage.getItem("userId");
      const response = await fetch(`${API_URL}/api/cart/${id}`);
      const data = await response.json();
      const total = data.reduce(function(sum, item) { return sum + item.quantity; }, 0);
      setCartCount(total);
    }
  }

  function handleProductsClick() {
    setPage("products");
  }

  async function handleCartClick() {
    await refreshCartCount();
    setPage("cart");
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    setUserId(null);
    setPage("login");
    setCartCount(0);
  }

  function handleProductClick(id) {
    setSelectedProductId(id);
    setPage("detail");
  }

  function handleBack() {
    setPage("products");
  }

  function handleLoginPage() {
    setPage("login");
  }

  function handleRegisterPage() {
    setPage("register");
  }

  if (!userId) {
    return (
      <div className="app">
        <div className="hero-section">
          <h1>Gözlük216</h1>
          <p className="slogan">Tarzını Yansıt</p>
        </div>
        {page === "login" ? (
          <>
            <Login onLogin={handleLogin} />
            <p onClick={handleRegisterPage} className="switch">
              Hesabın yok mu? Kayıt ol
            </p>
          </>
        ) : (
          <>
            <Register onRegister={handleRegister} />
            <p onClick={handleLoginPage} className="switch">
              Zaten hesabın var mı? Giriş yap
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="app">
     <nav className="navbar navbar-dark bg-dark px-4 mb-4 rounded">
  <h1 className="navbar-brand">Gözlük216</h1>
  <div className="d-flex gap-2">
    <button className="btn btn-outline-light" onClick={handleProductsClick}>Ürünler</button>
    <button className="btn btn-outline-light" onClick={handleCartClick}>
      Sepet {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
    </button>
    <button className="btn btn-outline-danger" onClick={handleLogout}>Çıkış</button>
  </div>
</nav>
      {page === "products" && (
        <Products
          userId={userId}
          onCartUpdate={refreshCartCount}
          onProductClick={handleProductClick}
        />
      )}
      {page === "detail" && (
        <ProductDetail
          productId={selectedProductId}
          userId={userId}
          onBack={handleBack}
          onCartUpdate={refreshCartCount}
        />
      )}
      {page === "cart" && (
  <Cart
    userId={userId}
    onCartUpdate={refreshCartCount}
    onCheckout={(items, total) => {
      setCartItems(items);
      setCartTotal(total);
      setPage("checkout");
    }}
  />
)}
{page === "checkout" && (
  <Checkout
    onBack={() => setPage("cart")}
    cartItems={cartItems}
    total={cartTotal}
  />
)}
    </div>
  );
}

export default App;