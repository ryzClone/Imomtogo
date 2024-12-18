import React, { useEffect, useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa";
import "../../style/history.css";
import Referense from "../Referense";
import { useNavigate } from "react-router-dom";

export default function Texhistory({ closeModal, user }) {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionFetch, setSelectedOptionFetch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [total, setTotal] = useState(100);
  const inv_tex = user.inv_tex || user.инвентарный_номер_техники;

  const BACK_API = process.env.REACT_APP_BACK_API;

  const navigate = useNavigate();

    // Message Modal
    const [text, setText] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [size, page, searchTerm, selectedOption]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);

  const handleDropdownOptionClick = (option) => {
    let filterKey = "";
    switch (option) {
      case "Пользователь":
        filterKey = "username";
        break;
      case "Сотрудник":
        filterKey = "employee_fio";
        break;
      case "Отдел сотрудника":
        filterKey = "employee_podrazdelenie";
        break;
      default:
        filterKey = "";
    }

    setSelectedOption(option);
    setSelectedOptionFetch(filterKey);
    setIsDropdownOpen(false);
  };

  const maxPage = Math.ceil(total / size);

  const pagePrev = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const pageNext = () => {
    if (page < maxPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const fetchHistory = async () => {
    // Frontendda yuboriladigan ma'lumotlar
    const data = {
      page,
      size,
      search: searchTerm,
      filter: selectedOptionFetch,
      inv_tex,
    };
  
    console.log("Fetch tex history request data:", data);
  
    try {
      // Tokenni olish
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      // URL params yaratish
      const queryParams = new URLSearchParams(data).toString();
      const url = `${BACK_API}api/readtexhistory?${queryParams}`;
  
      // So‘rov yuborish
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  
      // Agar token muddati tugagan bo‘lsa
      if (response.status === 403) {
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false); // Xabarni yashirish
          navigate("/"); // Login sahifasiga yo‘naltirish
        }, 3000);
        return;
      }
  
      // So‘rov muvaffaqiyatli bajarilganda
      if (response.ok) {
        const result = await response.json();
        
        setHistoryData(result.data); // Update state with tex history data
        setTotal(result.total); // Update total count
      } else {
        console.error(
          `Error fetching tex history. Status: ${response.status}, Message: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  
  
  
  const renderSuccessMessage = () => {
    if (showSuccess) {
      return <Referense title={text} background={success} />;
    }
  };

  return (
    <div className="history_modal-overlay" onClick={handleClose}>
      <div className="history_modal-content">
        <button className="history_modal-close" onClick={closeModal}>
          <FaTimes />
        </button>
        <div className="history_modal-controls">
          <div className="pagination">
            <button className="pagination-button" onClick={pagePrev}>
              <FaChevronLeft />
            </button>
            <div className="pagination-page">{page}</div>
            <button className="pagination-button" onClick={pageNext}>
              <FaChevronRight />
            </button>
            <select
              className="pagination-select"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
            >
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
            </select>
            <div className="pagination-total">общий: {total}</div>
          </div>
          <div className="history_modal-controls-right">
            <div className="history_modal-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="history_modal-dropdown">
              <div className="custom-dropdown">
                <button
                  className="custom-dropdown-button"
                  onClick={handleDropdownToggle}
                >
                  {selectedOption || "Пользователь"}
                </button>
                {isDropdownOpen && (
                  <div className="custom-dropdown-content">
                    <a
                      href="#"
                      onClick={() => handleDropdownOptionClick("Пользователь")}
                    >
                      Пользователь
                    </a>
                    <a
                      href="#"
                      onClick={() => handleDropdownOptionClick("Сотрудник")}
                    >
                      Сотрудник
                    </a>
                    <a
                      href="#"
                      onClick={() => handleDropdownOptionClick("Отдел сотрудника")}
                    >
                      Отдел сотрудника
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="history_modal-body">
          <h2>ИСТОРИЯ ТЕХНИКИ</h2>
          <table className="history_info-table">
            {historyData.length > 0 ? (
              <thead>
                <tr>
                  <th>Ид</th>
                  <th>Имя пользователя</th>
                  <th>Наименования тех</th>
                  <th>инв тех</th>
                  <th>Статус</th>
                  <th>описание</th>
                  <th>Дата</th>
                </tr>
              </thead>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={7}>Нет записей.</td>
                </tr>
              </tbody>
            )}
            <tbody>
              {historyData.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1 + (page - 1) * size}</td>
                  <td>{row.username}</td>
                  <td>{row.naimenovaniya_tex}</td>
                  <td>{row.inv_tex}</td>
                  <td>{row.status}</td>
                  <td>{row.description}</td>
                  <td>{new Date(row.data).toLocaleString("ru-RU", { timeZone: "UTC" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {renderSuccessMessage()}
    </div>
  );
}
