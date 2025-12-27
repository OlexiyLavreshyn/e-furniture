import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/Order.css';


export default function Order() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    country: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await Axios.get("/api/orders/addresses", { withCredentials: true });
        setAddresses(res.data || []);
        // preselect first existing address if any
        if (res.data && res.data.length > 0) {
          setSelectedAddressId(res.data[0].idaddresses || res.data[0].id); // adapt if field name differs
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
        // If 401, user probably not logged in — you may redirect to login
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, []);

  const handleCreateOrder = async () => {
    setError("");
    // Validation
    if (!useNewAddress && !selectedAddressId) {
      setError("Please select an existing address or add a new one.");
      return;
    }
    if (useNewAddress) {
      const { street, city, country } = newAddress;
      if (!street.trim() || !city.trim() || !country.trim()) {
        setError("Please fill all fields for the new address.");
        return;
      }
    }

    try {
      setLoading(true);

      const body = useNewAddress
        ? { newAddress, paymentMethod }
        : { addressId: selectedAddressId, paymentMethod };

      const res = await Axios.post(
        "/api/orders/create",
        body,
        { withCredentials: true }
      );

      // success
      alert("Order created ✅");
      navigate("/MainPage"); // or navigate to order-success page
    } catch (err) {
      console.error("Create order failed:", err);
      const msg = err?.response?.data?.message || "Failed to create order";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="order-page">
  <h1 className="order-title">Create Order</h1>

  <div className="order-row order-toggle">
    <label className="order-toggle-label">
      <input
        type="checkbox"
        checked={useNewAddress}
        onChange={(e) => setUseNewAddress(e.target.checked)}
      />
      Use a new address
    </label>
  </div>

  {!useNewAddress && (
    <div className="order-block">
      <h3 className="order-subtitle">Choose saved address</h3>

      {loadingAddresses ? (
        <p>Loading addresses...</p>
      ) : (
        <>
          {addresses.length === 0 && (
            <p>No saved addresses. Toggle "Use a new address" to add one.</p>
          )}

          {addresses.map((a) => {
            const id = a.idaddresses ?? a.id;
            return (
              <div key={id} className="order-address-card">
                <label className="order-address-label">
                  <input
                    type="radio"
                    name="address"
                    checked={String(selectedAddressId) === String(id)}
                    onChange={() => setSelectedAddressId(id)}
                    className="order-address-radio"
                  />
                  <span className="order-address-street">{a.street}</span>
                  <div className="order-address-meta">
                    {a.city}, {a.country}
                  </div>
                </label>
              </div>
            );
          })}
        </>
      )}
    </div>
  )}

  {useNewAddress && (
    <div className="order-block">
      <h3 className="order-subtitle">New address</h3>

      <div className="order-field-row">
        <input
          className="order-input order-input-full"
          placeholder="Street, house, apt"
          value={newAddress.street}
          onChange={(e) =>
            setNewAddress((s) => ({ ...s, street: e.target.value }))
          }
        />
      </div>

      <div className="order-field-row order-field-row--two">
        <input
          className="order-input"
          placeholder="City"
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress((s) => ({ ...s, city: e.target.value }))
          }
        />
        <input
          className="order-input"
          placeholder="Country"
          value={newAddress.country}
          onChange={(e) =>
            setNewAddress((s) => ({ ...s, country: e.target.value }))
          }
        />
      </div>
    </div>
  )}

  <div className="order-block">
    <h3 className="order-subtitle">Payment method</h3>
    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
      className="order-select"
    >
      <option value="card">Card</option>
      <option value="cash">Cash on delivery</option>
      <option value="paypal">PayPal</option>
    </select>
  </div>

  {error && <div className="order-error">{error}</div>}

  <div className="order-actions">
    <button
      onClick={handleCreateOrder}
      disabled={loading}
      className="order-btn order-btn-primary"
    >
      {loading ? "Placing order..." : "Place Order"}
    </button>

    <button
      onClick={() => navigate(-1)}
      className="order-btn order-btn-secondary"
    >
      Cancel
    </button>
  </div>
</div>
  );
}
