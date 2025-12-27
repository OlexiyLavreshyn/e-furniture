import React from 'react';
import Axios from "axios";
import '../css/Profile.css';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";



export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users/profile', {
      method: 'GET',
      credentials: 'include', // IMPORTANT: sends the auth cookie
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to load profile');
        }
        return res.json();
      })
      .then((data) => {
        // Your API returns an array, so we take the first item
        setProfile(data[0]);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) return <h2>{error}</h2>;
  if (!profile) return <h2>Loading profile...</h2>;

  return (
<div className="profile-page">

  <h1 className="profile-page-title">Особистий кабінет</h1>

  {/* Блок особистих даних */}
  <section className="profile-card">
    <h2 className="profile-card-title">Особисті дані</h2>

    <div className="profile-grid">
      <div className="profile-field">
        <span className="profile-label">Імʼя</span>
        <span className="profile-value">{profile.name}</span>
      </div>

      <div className="profile-field">
        <span className="profile-label">Email</span>
        <span className="profile-value">{profile.email}</span>
      </div>

      <div className="profile-field">
        <span className="profile-label">Телефон</span>
        <span className="profile-value">{profile.phone_number}</span>
      </div>

      {/* Можеш залишити порожні поля як заглушки */}
      <div className="profile-field">
        <span className="profile-label">Дата народження</span>
        <span className="profile-value">-</span>
      </div>
    </div>

    <button className="profile-edit-btn">
      <span className="profile-edit-icon">✏️</span>
      <span>Редагувати</span>
    </button>
  </section>

  {/* Блок зміни пароля */}
  <section className="profile-card">
    <h2 className="profile-card-title">Зміна пароля</h2>

    <div className="profile-grid">
      <div className="profile-field">
        <span className="profile-label">Пароль</span>
        <span className="profile-value">********</span>
      </div>
    </div>

    <button className="profile-edit-btn">
      <span className="profile-edit-icon">✏️</span>
      <span>Редагувати</span>
    </button>

    <Link to="/AdminProducts" className="profile-second-btn">
    Admin Menu
    </Link>

  </section>

</div>

  );
}