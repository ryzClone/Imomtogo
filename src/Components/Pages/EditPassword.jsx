import React, { useState } from "react";
import "../style/EditPasswod.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Referense from "./Referense";
import { useNavigate } from "react-router-dom";

export default function EditPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Сообщение-модальное окно
  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState("");

  const BACK_API = process.env.REACT_APP_BACK_API;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем, совпадают ли новый пароль и подтверждение пароля
    if (newPassword !== confirmPassword) {
      setSuccess(false);
      setText("Новый пароль и подтверждение пароля не совпадают.");
      return;
    }

    try {
      const username = localStorage.getItem("username");

      if (!username) {
        setSuccess(false);
        setText("Информация о пользователе не найдена. Пожалуйста, попробуйте снова войти.");
        return;
      }

      // Отправляем данные на сервер
      const response = await fetch(`${BACK_API}api/updatepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username, 
          oldPassword,
          newPassword, 
        }),
      });

      // Проверка на истечение срока действия токена (статус 403)
      if (response.status === 403) {
        setText("Срок действия вашего токена истек.");
        setSuccess(false);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false); // Скрываем сообщение об ошибке через 3 секунды
          navigate("/"); // Перенаправляем на страницу входа
        }, 3000);
        return; // Выходим, если токен истек
      }

      // Вызываем response.json() только один раз и сохраняем результат
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setText(data.message || "Пароль успешно обновлён.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setSuccess(false);
        setText(data.message || "Произошла ошибка при обновлении пароля.");
      }
    } catch (error) {
      setSuccess(false);
      setText(error.message || "Ошибка соединения с сервером.");
    } finally {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 3000);
    }
  };

  const renderSuccessMessage = () => {
    if (showSuccess) {
      return <Referense title={text} background={success} />;
    }
  };

  return (
    <div className="container">
      <h2>Изменить пароль</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="oldPassword">Старый пароль:</label>
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
          <label htmlFor="newPassword">Новый пароль:</label>
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
          <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
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
          Изменить
        </button>
      </form>
      {renderSuccessMessage()}
    </div>
  );
}
