import React, { useState } from "react";
import './LoginForm.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="wrapper">
      <form action="">
        <h1>{isRegister ? "Register" : "Login"}</h1>

        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaLock className="icon" />
        </div>

        {isRegister && (
          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>
        )}

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>

          {!isRegister && <a href="#">Forgot password?</a>}
        </div>

        <button type="submit">{isRegister ? "Register" : "Login"}</button>

        <div className="register-link">
          <p>
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsRegister(!isRegister);
              }}
            >
              {isRegister ? "Login" : "Register"}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
