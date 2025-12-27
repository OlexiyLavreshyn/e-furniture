import React from 'react';
import Axios from "axios";
import '../css/MainPage.css';



async function getProducts() {
  try {
    const response = await Axios.get("/api/products/products"); // again through nginx
    console.log("Products:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

getProducts();

const MainPage = () => {
  return (
    <div>
      <div class="page-bg"></div>

  
  <div className="MainPage"></div>

<p id="TopSale">Хіт продажу</p>

 <div className="slider">
      <div className="slides">

        {/* Radio-кнопки */}
        <input type="radio" name="slide" id="slide1" defaultChecked />
        <input type="radio" name="slide" id="slide2" />
        <input type="radio" name="slide" id="slide3" />

        {/* 3 слайди */}
        <div className="slide s1"></div>
        <div className="slide s2"></div>
        <div className="slide s3"></div>
      </div>

      {/* Навігація */}
      <div className="nav-manual">
        <label htmlFor="slide1" className="manual-btn"></label>
        <label htmlFor="slide2" className="manual-btn"></label>
        <label htmlFor="slide3" className="manual-btn"></label>
      </div>
    </div>
  
    </div>
    
  );
};

export default MainPage;