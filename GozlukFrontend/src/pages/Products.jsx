import { useEffect, useState } from "react";

function Products({ userId, onCartUpdate, onProductClick }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState("");
  const [brand, setBrand] = useState("Tümü");
  const [gender, setGender] = useState("Tümü");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("http://localhost:5000/api/Product");
      const data = await response.json();
      setProducts(data);
      setFiltered(data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (brand !== "Tümü") {
      result = result.filter(function(p) { return p.brand === brand; });
    }

    if (gender !== "Tümü") {
      result = result.filter(function(p) { return p.gender === gender; });
    }

    if (sort === "asc") {
      result.sort(function(a, b) { return a.price - b.price; });
    } else if (sort === "desc") {
      result.sort(function(a, b) { return b.price - a.price; });
    }

    setFiltered(result);
  }, [brand, gender, sort, products]);

  async function addToCart(productId) {
    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: 1
        })
      });
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await response.json();
      const total = data.reduce(function(sum, item) { return sum + item.quantity; }, 0);
      onCartUpdate(total);
      setMessage("Ürün sepete eklendi!");
      setTimeout(function() { setMessage(""); }, 2000);
    } catch (err) {
      setMessage("Hata oluştu.");
    }
  }

  function handleBrandChange(e) {
    setBrand(e.target.value);
  }

  function handleGenderChange(e) {
    setGender(e.target.value);
  }

  function handleSortChange(e) {
    setSort(e.target.value);
  }

  function handleReset() {
    setBrand("Tümü");
    setGender("Tümü");
    setSort("default");
  }

  function handleProductClick(id) {
    onProductClick(id);
  }

  function handleAddToCart(e, productId) {
    e.stopPropagation();
    addToCart(productId);
  }

  const brands = ["Tümü", ...new Set(products.map(function(p) { return p.brand; }))];

  return (
    <div className="products-container">
      <h2>Güneş Gözlükleri</h2>

      <div className="filters">
        <select value={brand} onChange={handleBrandChange}>
          {brands.map(function(b) {
            return <option key={b} value={b}>{b}</option>;
          })}
        </select>

        <select value={gender} onChange={handleGenderChange}>
          <option value="Tümü">Tüm Cinsiyetler</option>
          <option value="Erkek">Erkek</option>
          <option value="Kadın">Kadın</option>
          <option value="Unisex">Unisex</option>
        </select>

        <select value={sort} onChange={handleSortChange}>
          <option value="default">Sıralama</option>
          <option value="asc">Fiyat: Artan</option>
          <option value="desc">Fiyat: Azalan</option>
        </select>

        <button className="reset-btn" onClick={handleReset}>
          Filtreleri Sıfırla
        </button>
      </div>

     <div className="message-area">
  {message && <div className="alert alert-success">{message}</div>}
          </div>

      <div className="products-grid">
        {filtered.map(function(p) {
          return (
            <div key={p.id} className="card" onClick={() => handleProductClick(p.id)}>
              <img src={p.imageUrl} alt={p.name} className="card-img-top" onError={function(e) { e.target.style.display = "none"; }} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text brand">{p.brand} - {p.model}</p>
                <p className="card-text description">{p.description}</p>
                <p className="card-text price">{p.price.toLocaleString("tr-TR")} ₺</p>
                <button className="btn btn-dark w-100" onClick={function(e) { handleAddToCart(e, p.id); }}>Sepete Ekle</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;