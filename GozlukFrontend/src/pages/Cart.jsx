import { useEffect, useState } from "react";

function Cart({ userId, onCartUpdate, onCheckout }) {
  const [items, setItems] = useState([]);

  async function fetchCart() {
    const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
    const data = await response.json();
    setItems(data);
    const total = data.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    onCartUpdate(total);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function removeItem(id) {
    await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: "DELETE"
    });
    fetchCart();
  }

  async function handleIncrease(item) {
    const newQuantity = item.quantity + 1;
    await fetch(`http://localhost:5000/api/cart/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: newQuantity
      })
    });
    fetchCart();
  }

  async function handleDecrease(item) {
    const newQuantity = item.quantity - 1;
    if (newQuantity <= 0) {
      await fetch(`http://localhost:5000/api/cart/${item.id}`, {
        method: "DELETE"
      });
    } else {
      await fetch(`http://localhost:5000/api/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          userId: item.userId,
          productId: item.productId,
          quantity: newQuantity
        })
      });
    }
    fetchCart();
  }

  const total = items.reduce(function(sum, item) { return sum + item.product.price * item.quantity; }, 0);

  return (
    <div className="cart-container">
      <h2>Sepetim</h2>
      {items.length === 0 ? (
        <div className="alert alert-warning">Sepetiniz boş.</div>
      ) : (
        <>
          {items.map(function(item) {
            return (
              <div key={item.id} className="cart-item">
                <span className="cart-item-name">{item.product.name}</span>
                <span className="cart-item-brand">{item.product.brand}</span>
                <div className="cart-quantity">
                  <button className="btn btn-outline-secondary" onClick={() => handleDecrease(item)}>−</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button className="btn btn-outline-secondary" onClick={() => handleIncrease(item)}>+</button>
                </div>
                <span>{(item.product.price * item.quantity).toLocaleString("tr-TR")} ₺</span>
                <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Kaldır</button>
              </div>
            );
          })}
          <div className="cart-total">
            <strong>Toplam: {total.toLocaleString("tr-TR")} ₺</strong>
          </div>
          <button className="btn btn-success w-100 mt-3" onClick={() => onCheckout(items, total)}>
            Ödemeye Geç
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;