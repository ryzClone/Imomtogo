import React, { useState } from "react";
import "../style/Loginpage.css";
import LoginImg from "../images/Loginpage.jpg";
import Referense from "./Referense";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "asd" && password === "123") {
      setTimeout(() => {
        setShowSuccess(false);
        window.location.pathname = "/website";
      }, 3000);

      setSuccess(true);
      setText("Success");
      setShowSuccess(true);
    } else {
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      setSuccess(false);
      setText("Username or password error");
      setShowSuccess(true);
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
    <div className="loginpage-container">
      <div className="loginpage-image">
        <img src={LoginImg} alt="Login" />
      </div>
      <div className="loginpage-form">
        <h2>Imom Togo proekti</h2>
        <h5>username: asd </h5>
        <h5>password: 123</h5>

        <form onSubmit={handleSubmit} className="loginpage-form-body">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
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
  );
}
