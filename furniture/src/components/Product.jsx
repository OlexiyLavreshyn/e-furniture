import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Product.css";
import Axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const [good, setGood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // default quantity 1

  useEffect(() => {
    const loadGood = async () => {
      try {
        const res = await Axios.get(`/api/products/product/${id}`);
        setGood(res.data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити товар");
      } finally {
        setLoading(false);
      }
    };

    loadGood();
  }, [id]);

  const addToCart = async () => {
    try {
      await Axios.post(
        '/api/carts/add',
        { productId: good.idgoods, quantity },
        { withCredentials: true }
      );
      alert(`Added ${quantity} ${good.name}(s) to cart`);
    } catch (err) {
      alert(err);
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;
  if (!good) return <p>Товар не знайдено</p>;

  return (
<div className="product-page">

  {/* ВЕРХНІЙ БЛОК */}
  <div className="product-layout">
    
    {/* ЛІВА СТОРОНА — ФОТО */}
    <div className="product-left">
      <img src={good.image} className="product-image" />

      {/* Назва під фото (як на другому скріні під галереєю) */}
      <h1 className="product-name-under-img">{good.name}</h1>
    </div>

    {/* ПРАВА СТОРОНА — НАЗВА, ЦІНА, КОЛІР, КІЛЬКІСТЬ, КНОПКИ */}
    <div className="product-right">

      <h1 className="product-title">{good.name}</h1>
      <p className="product-article">Артикул: GIK-{good.idgoods}</p>

      <div className="product-price">{good.default_price} грн</div>

      <button className="delivery-link">
        Доставка НП за 120 грн
      </button>

      {/* Колір */}
      <div className="product-row">
        <span className="row-label">Колір:</span>
        <div className="color-circle" />
        <span className="row-value">{good.color}</span>
      </div>

      {/* Кількість (як у макеті з – 1 +) */}
      <div className="product-row">
        <span className="row-label">Кількість:</span>
        <div className="qty-box">
          <button
            type="button"
            className="qty-btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="qty-value">{quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* КНОПКИ як у прикладі */}
      <div className="product-actions">
        <button className="add-to-cart" onClick={addToCart}>
          Додати у кошик
        </button>
        <button className="buy-now">
          Купити
        </button>
        <button className="wishlist-btn">
          ♥
        </button>
      </div>
    </div>
  </div>

  {/* НИЖНІЙ БЛОК — ОПИС + ГАБАРИТИ */}
  <div className="product-bottom">
    <div className="bottom-left">
      <h2>Розміри</h2>
      <p>Ширина: 1000 мм</p>
      <p>Висота: 818 мм</p>
      <p>Глибина: 400 мм</p>

      <h2 style={{ marginTop: "20px" }}>Опис</h2>
      <p>{good.about}</p>
    </div>


  </div>

</div>


  );
}

export default ProductDetails;
