import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/Cart.css';


export default function Cart() {
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await Axios.get('/api/carts/cart', { withCredentials: true });
      setItems(res.data);
    } catch {
      alert('Login required');
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (cartId, quantity) => {
    try {
      await Axios.post(
        '/api/carts/update',
        { cartId, quantity },
        { withCredentials: true }
      );
      loadCart();
    } catch (err){
      alert(cartId);
    }
  };

  const removeItem = async (cartId) => {
    try {
      await Axios.delete(`/api/carts/remove/${cartId}`, { withCredentials: true });
      loadCart();
    } catch (err){
      alert(cartId);
    }
  };

  const handleChange = (cartId, value) => {
    const qty = Math.max(1, Number(value));
    updateQuantity(cartId, qty);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.default_price * item.quantity, 0);

  return (
<div className="cart-page">
  <h1 className="cart-title">Your Cart</h1>

  {items.length === 0 && <p className="cart-empty">Cart is empty</p>}

  {items.map((item) => (
    <div key={item.cartId} className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />

      <div className="cart-item-info">
        <p className="cart-item-name"><b>{item.name}</b></p>
        <p className="cart-item-price">Price: {item.default_price} грн</p>

        <div className="cart-item-controls">
          <label className="cart-qty-label">
            Qty:
            <input
              type="number"
              value={item.quantity}
              min="1"
              className="cart-qty-input"
              onChange={(e) => handleChange(item.cartId, e.target.value)}
            />
          </label>

          <button
            onClick={() => removeItem(item.cartId)}
            className="cart-remove-btn"
          >
            Remove
          </button>
        </div>

        <p className="cart-item-total">
          Total: {item.default_price * item.quantity} грн
        </p>
      </div>
    </div>
  ))}

  {items.length > 0 && (
    <h2 className="cart-grand-total">Grand Total: {totalPrice} грн</h2>
  )}

  {items.length > 0 && (
    <button
      onClick={() => navigate("/order")}
      className="cart-order-btn"
    >
      Proceed to Order
    </button>
  )}
</div>
  );
}
