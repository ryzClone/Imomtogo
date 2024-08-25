import React, { useState } from "react";
import "../style/EditPasswod.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function EditPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Yangi parol va tasdiqlash paroli mos kelmaydi.");
      return;
    }

    setError("");
  };

  return (
    <div className="container">
      <h2>Change Password</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type={showOldPassword ? "text" : "password"}
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="edit-password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div className="input-container">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="edit-password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div className="input-container">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="edit-password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <button type="submit" className="edit-password-button">
          Change
        </button>
      </form>
    </div>
  );
}
