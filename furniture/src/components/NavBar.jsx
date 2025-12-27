import React from 'react';
import Axios from "axios";
import { Link } from "react-router-dom";
import '../css/NavBar.css';

const NavBar = () => {
  return (
    <div>
         <header class="navbar">
    <div class="nav-inner">
      <a class="brand" href="#">qwerty</a>

      <nav>
        <ul class="menu">
          <li><Link to="/MainPage">Головна</Link></li>
          <li><Link to="/ChillZone">Обідня зона</Link></li>

          <li class="dropdown">
            <a href="#">Вітальня</a>
            <div class="dropdown-panel">
              <ul>
                <li><Link to="/StandartSofa">Прямі дивани</Link></li>
                <li><Link to="/CornerSofa">Кутові дивани</Link></li>
                <li><Link to="/ModuleSofa">Модульні дивани</Link></li>
                <li><Link to="/ChairPoufs">Крісла та пуфи</Link></li>
                <li><Link to="/TVStands">TV-тумби</Link></li>
                <li><Link to="/CoffeeTable">Журнальні столики</Link></li>
              </ul>
            </div>
          </li>

          <li class="dropdown">
            <a href="#">Спальня</a>
            <div class="dropdown-panel">
              <ul>
                <li><Link to="/Beds">Ліжка</Link></li>
                <li><Link to="/Mattresses">Матраси</Link></li>
                <li><Link to="/Pillows">Подушки</Link></li>
                <li><Link to="/BedsideTables">Тумби прикроватні</Link></li>
                <li><Link to="/Dressers">Комоди</Link></li>
                <li><Link to="/VanityTables">Туалетні столики</Link></li>
                <li><Link to="/Wardrobes">Шафи</Link></li>
              </ul>
            </div>
          </li>

          <li class="dropdown">
            <a href="#">Корпус</a>
            <div class="dropdown-panel">
              <ul>
                <li><a href="#">Колекція Apple</a></li>
                <li><a href="#">Колекція Glass Lake</a></li>
                <li><a href="#">Колекція Lego</a></li>
                <li><a href="#">Колекція Julia</a></li>
                <li><a href="#">Колекція Laconik</a></li>
                <li><a href="#">Колекція Marcello</a></li>
              </ul>
            </div>
          </li>

          <li><a href="#">Про нас</a></li>
        </ul>
      </nav>
    </div>

 <div className="profile">
      <button class="profile-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M5.5 21a7.5 7.5 0 0 1 13 0"></path>
        </svg>
      </button>

      <div class="profile-menu">
        <ul>
          <li><Link to="/LoginForm">Увійти</Link></li>
          <li><Link to="/SignUpForm">Реєстрація</Link></li>
          <li><Link to="/Profile">Мій кабінет</Link></li>
          <li><Link to="/Cart">Корзина</Link></li>
          <li><a href="#">Вихід</a></li>
        </ul>
      </div>
      </div>
    
  </header>
    </div>
  );
};

export default NavBar;