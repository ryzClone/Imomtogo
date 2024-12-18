import React, { useState, useEffect } from "react";
import "../../style/Addusermodal.css"; // Modal uchun CSS

export default function UpdateModalTexnika({ show, onClose, onSubmit, user }) {
  const [formData, setFormData] = useState({
    naimenovaniya_tex: "",
    inv_tex: "",
    seriyniy_nomer: "",
    mac_address: "",
    id: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        naimenovaniya_tex: user.naimenovaniya_tex || "",
        inv_tex: user.inv_tex || "",
        seriyniy_nomer: user.seriyniy_nomer || "",
        mac_address: user.mac_address || "",
        id: user.id || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Modal ichida bosishni to'xtatish
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Обновить техническую информацию</h2>
        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <input type="hidden" name="id" value={formData.id} />
          <label className="modal-label">
            Наименование тех:
            <input
              className="modal-input"
              type="text"
              name="naimenovaniya_tex"
              value={formData.naimenovaniya_tex}
              onChange={handleChange}
              required
            />
          </label>
          <label className="modal-label">
            ИНВ номер:
            <input
              className="modal-input"
              type="text"
              name="inv_number"
              value={formData.inv_tex}
              onChange={handleChange}
              required
            />
          </label>
          <label className="modal-label">
            Серийный номер:
            <input
              className="modal-input"
              type="text"
              name="serial_number"
              value={formData.seriyniy_nomer}
              onChange={handleChange}
              required
            />
          </label>
          <label className="modal-label">
            MAC-адрес:
            <input
              className="modal-input"
              type="text"
              name="mac_address"
              value={formData.mac_address}
              onChange={handleChange}
              required
            />
          </label>
          <button className="modal-submit" type="submit">
            Обнавить
          </button>
        </form>
      </div>
    </div>
  );
}
