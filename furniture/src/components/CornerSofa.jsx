import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/CornerSofa.css';

const API_URL = "/api/products/products?category=CornerSofa";

const CornerSofa = () => {

    const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadGoods = async () => {
      try {
        const res = await Axios.get(API_URL);
        setGoods(res.data);
      } catch (err) {
        console.error("API error:", err);
        setError("Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    };

    loadGoods();
  }, []);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ChillBG">
    <div className="goods-wrapper">

<div className="goods-container">
  {goods.map((item) => (
    <div
      className="goods-card"
      key={item.idgoods}
      onClick={() => navigate(`/product/${item.idgoods}`)}
    >
      <img
        src={item.image || "https://via.placeholder.com/400"}
        alt={item.name}
        className="goods-image"
      />

      <h3 className="goods-name">{item.name}</h3>

      <p className="goods-price">{item.default_price} грн</p>

      <p className="goods-category">Категорія: {item.categorie}</p>

      <p className="goods-about">{item.about}</p>

      <button className="goods-buy-btn">Купити</button>
    </div>
  ))}
</div>


    </div>
    </div>
  );
};

export default CornerSofa;