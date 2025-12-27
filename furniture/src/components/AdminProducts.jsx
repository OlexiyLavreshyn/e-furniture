import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../css/AdminProducts.css";

const API_URL = "/api/products/products";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // форма для додавання товару
  const [form, setForm] = useState({
    name: "",
    categorie: "",
    about: "",
    color: "",
    quantity_in_stock: "",
    default_price: "",
    discount: "",
    supplier_id: "",
    image: "",
  });

  // завантажити всі товари
  const loadProducts = async () => {
    try {
      const res = await Axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити товари");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 ДОДАТИ товар
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await Axios.post(API_URL, form);
      // очистити форму
      setForm({
        name: "",
        categorie: "",
        about: "",
        color: "",
        quantity_in_stock: "",
        default_price: "",
        discount: "",
        supplier_id: "",
        image: "",
      });
      // оновити список
      loadProducts();
    } catch (err) {
      console.error(err);
      setError("Помилка при додаванні товару");
    }
  };

  // 👉 ВИДАЛИТИ товар
  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цей товар?")) return;

    try {
      await Axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p.idgoods !== id));
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити товар");
    }
  };

  return (
    <div className="admin-products-page">
      <h1>Адмін: товари</h1>

      {error && <div className="admin-error">{error}</div>}

      {/* ФОРМА ДОДАВАННЯ ТОВАРУ */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>Додати товар</h2>

        <div className="form-grid">
          <div className="form-field">
            <label>Назва</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Категорія</label>
            <input
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Колір</label>
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Кількість на складі</label>
            <input
              type="number"
              name="quantity_in_stock"
              value={form.quantity_in_stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Ціна (грн)</label>
            <input
              type="number"
              name="default_price"
              value={form.default_price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Знижка (%)</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>ID постачальника</label>
            <input
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-field full">
            <label>URL зображення</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-field full">
            <label>Опис</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Додати товар
        </button>
      </form>

      {/* СПИСОК ТОВАРІВ */}
      <div className="admin-products-list">
        <h2>Список товарів</h2>

        {products.map((p) => (
          <div key={p.idgoods} className="admin-product-row">
            <div className="row-main">
              <strong>{p.name}</strong>
              <span>Ціна: {p.default_price} грн</span>
              {p.quantity_in_stock !== undefined && (
                <span>Склад: {p.quantity_in_stock}</span>
              )}
            </div>

            <button
              className="btn-danger"
              onClick={() => handleDelete(p.idgoods)}
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
