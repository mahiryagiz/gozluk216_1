import { useEffect, useState } from "react";

function ProductDetail({ productId, userId, onBack, onCartUpdate }) {
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`http://localhost:5000/api/Product/${productId}`);
      const data = await response.json();
      setProduct(data);
    }
    fetchProduct();
  }, [productId]);

  async function addToCart() {
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
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate(total);
      setMessage("Ürün sepete eklendi!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Hata oluştu.");
    }
  }

  if (!product) return <p>Yükleniyor...</p>;

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={onBack}>← Geri</button>
      <div className="detail-card">
        <img src={product.imageUrl} alt={product.name} />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="brand">{product.brand} - {product.model}</p>
          <p className="description">{product.description}</p>
          <p className="gender">Cinsiyet: {product.gender}</p>
          <p className="stock">Stok: {product.stock} adet</p>
          <p className="price">{product.price.toLocaleString("tr-TR")} ₺</p>
          {message && <p className="success">{message}</p>}
          <button onClick={addToCart}>Sepete Ekle</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;