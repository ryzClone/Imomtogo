import React, { useState } from "react";
import "../style/Loginpage.css";
import LoginImg from "../images/Loginpage.jpg";
import Referense from "./Referense";

export default function LoginPage() {
  const [UserName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: UserName,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Username or password error");
      }

      const result = await response.json();
      console.log(result); // Barcha ma'lumotlarni ko'rish

      const { token, username, role } = result.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      setSuccess(true);
      setText("Success");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        window.location.pathname = "/website";
      }, 1000);
    } catch (error) {
      setSuccess(false);
      setText(error.message || "An error occurred");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }

    setUsername("");
    setPassword("");
  };

  const renderSuccessMessage = () => {
    if (showSuccess) {
      return <Referense title={text} background={success} />;
    }
  };

  return (
    <div className="loginpage-main">
      <div className="loginpage-container">
        <div className="loginpage-image">
          <img src={LoginImg} alt="Login" />
        </div>
        <div className="loginpage-form">
          <h2>Imom Togo proekti</h2>

          <form onSubmit={handleSubmit} className="loginpage-form-body">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={UserName}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
        {renderSuccessMessage()}
      </div>
    </div>
  );
}
