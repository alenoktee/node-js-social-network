import React, { useState } from "react";
import './LoginForm.css';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerUser, loginUser } from '../../api';

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    if (isRegister) {
      if (!passwordRegex.test(password)) {
        setMessage("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.");
        return;
      }
  
      try {
        if (email) {
          const emailResponse = await checkEmailAvailability(email);
          if (!emailResponse.isAvailable) {
            setMessage("Email is already registered.");
            return;
          }
        }
  
        if (username) {
          const usernameResponse = await checkUsernameAvailability(username);
          if (!usernameResponse.isAvailable) {
            setMessage("Username is already taken.");
            return;
          }
        }
  
        await registerUser(username, email, password);
        setMessage("Registration successful! You can now log in.");
        setIsRegister(false);
      } catch (error) {
        setMessage("Error: " + (error.response?.data?.error || "Something went wrong."));
      }
    } else {
      try {
        const response = await loginUser(username, password);
        const token = response.data.token;
        localStorage.setItem("token", token);
        setMessage("Login successful!");
      } catch (error) {
        setMessage("Error: " + (error.response?.data?.error || "Something went wrong."));
      }
    }
  };  
  
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`/api/check-username?username=${username}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking username availability", error);
      return { isAvailable: false };
    }
  };
  
  const checkEmailAvailability = async (email) => {
    try {
      const response = await fetch(`/api/check-email?email=${email}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking email availability", error);
      return { isAvailable: false };
    }
  };
  
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>{isRegister ? "Register" : "Login"}</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        {isRegister && (
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
          </div>
        )}

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showPassword ? (
            <FaEyeSlash
              className="icon" style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FaEye
              className="icon" style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
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
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
