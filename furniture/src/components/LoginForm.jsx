import React, { useState } from 'react';
import '../css/login.css';
import Axios from "axios";
import {useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await Axios.post(
        "/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Logged in:", res.data);

      navigate('/MainPage');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Network error");
      }
    }
  };

  const SignUpForm = () => {
    // Programmatically navigate to a specific route
    navigate('/SignUpForm');
  };
//<</form>button type="button" onClick={SignUpForm}>Sign Up</button>
  return (
    
    <div className="form-container">
      <form className="form">
        <h2>Вхід</h2>
        <div className='group'>
          <label>Електронна пошта</label>
          <input
            type="text"
            name="email"
            className="underline-input" // Apply custom input class
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </div>
        
        <div className='group'>
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            className="underline-input2" // Apply custom input class
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
        <div>
        <div className="buttonkab" onClick={login}>
        <div className="text321">
        <p>Увійти</p>
        </div>
        </div>


              <div className="register-link">
              <h5>Не маєте аккаунту?</h5>
              <a onClick={SignUpForm}>Зареєстуватись</a>
              </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
