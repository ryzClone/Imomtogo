import React from "react";
import "../style/Addusermodal.css"; // Modal uchun CSS

const Addusermodal = ({ show, onClose, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Add New User</h2>
        <form className="modal-form" onSubmit={onSubmit}>
          <label className="modal-label">
            Username:
            <input
              className="modal-input"
              type="text"
              name="username"
              required
            />
          </label>
          <label className="modal-label">
            Password:
            <input
              className="modal-input"
              type="password"
              name="password"
              required
            />
          </label>
          <label className="modal-label">
            Role:
            <select className="modal-select" name="role" required>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </label>
          <label className="modal-label">
            Status:
            <select className="modal-select" name="status" required>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <button className="modal-submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addusermodal;
