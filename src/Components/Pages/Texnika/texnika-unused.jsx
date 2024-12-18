import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
} from "react-icons/fa";
import "../../style/Users.css"; // CSS faylingiz
import Referense from "../Referense";
import { UserContext } from "../Users/userContex";
import History from "../History/History";
import UpdateModalTexnika from "./Updatetexnika";
import Texhistory from "../History/Texhistory";

export default function TexnikaUnused() {
  const navigate = useNavigate();
  const { search } = useContext(UserContext);

  // Pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(100);
  const [users, setUsers] = useState([]);

  // Message Modal
  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);

  // Search and Sort
  const [globSearch, setGlobSearch] = useState("");
  const [activeSort, setActiveSort] = useState(null);

  // Update and Add User
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserHistory, setSelectedUserHistory] = useState("");
  const [selectedUserUpdate, setSelectedUserUpdate] = useState("");

  // History
  const [showHistory, setShowHistory] = useState(false); // History
  const [showTexHistory, setShowTexHistory] = useState(false); // TexHistory


  // Dropdown Menu Active State
  const [activeMenuId, setActiveMenuId] = useState(null);

  const BACK_API = process.env.REACT_APP_BACK_API;

  // useEffect
  useEffect(() => {
    readAcception();
    setGlobSearch(search || "");
  }, [page, size, search, globSearch, activeSort]);

  const pagePrev = () => {
    if (page >= 2) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const pageNext = () => {
    if (page < Math.ceil(total / size)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Fetch Acception
  const readAcception = async () => {
    const data = {
      page: page,
      size: size,
      search: globSearch,
      filter: activeSort || "naimenovaniya_tex",
      status: "unused",
    };
  
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams(data).toString();
  
      const response = await fetch(
        `${BACK_API}api/readtexnika?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 403) {
        // Token muddati tugagan bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false); // Xabarni 3 soniyadan so'ng yashirish
          navigate("/"); // Login sahifasiga yo'naltirish
        }, 3000);
        return;
      }
  
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data);
        setTotal(result.total);
      } else {
        const errorResult = await response.json();
        console.log(errorResult.message);
      }
    } catch (error) {
      console.log("Xatolik yuz berdi:", error);
    }
  };

  // Update Acception
  const handleUpdate = (user) => {
    setSelectedUserUpdate(user);
  };
 
  const handleSendToRepair = async (user) => {
    try {
        const token = localStorage.getItem("token"); 
        const username = localStorage.getItem("username"); // username ni olish

        // Agar username mavjud bo'lsa, uni user ga qo'shamiz
        if (username) {
            user.username = username;
        }

        const response = await fetch(`${BACK_API}api/movetorepair`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify({ user: user }),
        });

        if (response.status === 403) {
            // Token muddati tugagan bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
            setText("Срок действия вашего токена истек");
            setSuccess(false);
            setShowSuccess(true);

            // 3 soniyadan so'ng foydalanuvchini login sahifasiga yo'naltirish
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/');
            }, 3000);
            return; // Keyingi kodlarni bajarishni to'xtatish
        }

        const data = await response.json();

        if (response.ok) {
            // Muvaffaqiyatli javobni ko'rsatish
            console.log(data.message);
            setSuccess(true); // Muvaffaqiyatni o'rnatish
            setText(data.message || "Texnika muvaffaqiyatli o'zgartirildi");
        } else {
            // Xatolik xabarini ko'rsatish
            console.error(data.message);
            setSuccess(false);
            setText(data.message || "Texnika o'zgartirishda xatolik yuz berdi");
        }
    } catch (error) {
        // Umumiy xatolikni ko'rsatish
        console.error("Error while sending to repair:", error);
        setSuccess(false);
        setText(error.message || "Texnika o'zgartirishda xatolik yuz berdi");
    } finally {
        // Modalni yoki muvaffaqiyat xabarini ko'rsatish
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            window.location.reload(); // Sahifani qayta yuklash
        }, 3000); // 3 soniya kutish
    }
};

const handleSendToTexnika = async (user) => {
  try {
    const token = localStorage.getItem("token"); // Tokenni localStorage'dan olish
    const username = localStorage.getItem("username"); // Username'ni olish
    
    // Agar username mavjud bo'lsa, uni user ma'lumotlariga qo'shamiz
    if (username) {
      user.username = username;
    }

    // API so'rovini yuborish
    const response = await fetch(`${BACK_API}api/movetotexnika`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Tokenni Authorization header'iga qo'shish
      },
      body: JSON.stringify({
        user: user, // Foydalanuvchi haqida barcha ma'lumotlarni yuborish
      }),
    });

    if (response.status === 403) {
      // Token muddati tugagan bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
      setText("Срок действия вашего токена истек");
      setSuccess(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false); // 3 soniyadan so'ng xabarni yashirish
        navigate("/"); // Login sahifasiga yo'naltirish
      }, 3000);
      return;
    }

    const data = await response.json();

    if (response.ok) {
      // Muvaffaqiyatli javobni ko'rsatish
      console.log(data.message);
      setSuccess(true);
      setText(data.message || "Texnika muvaffaqiyatli o'zgartirildi");
    } else {
      // Xatolik xabarini ko'rsatish
      console.error(data.message);
      setSuccess(false);
      setText(data.message || "Texnika o'zgartirishda xatolik yuz berdi");
    }
  } catch (error) {
    // Umumiy xatolikni ko'rsatish
    console.error("Error while sending to unused:", error);
    setSuccess(false);
    setText(error.message || "Texnika o'zgartirishda xatolik yuz berdi");
  } finally {
    // Modalni yoki muvaffaqiyat xabarini ko'rsatish
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      window.location.reload(); // Sahifani qayta yuklash
    }, 3000); // 3 soniya kutish
  }
};

  const toggleMenu = (id) => {
    if (activeMenuId === id) {
      setActiveMenuId(null); // Agar shu menyu ochiq bo'lsa, yopiladi
    } else {
      setActiveMenuId(id); // Aks holda, menyu ochiladi
    }
  };

  // User Table
  const acceptionTable = () => {
    return users.map((user, index) => (
      <tr key={user.id}>
        <td>{index + 1 + (page - 1) * size}</td>
        <td>{user.naimenovaniya_tex}</td>
        <td>{user.inv_tex}</td>
        <td>{user.seriyniy_nomer}</td>
        <td>{user.mac_address}</td>
        <td>{user.data_formatted}</td>
        <td>{user.status}</td>
        <td className="edit-btns">
          <div className="menu-options">
            <button className="menu-icon" onClick={() => toggleMenu(user.id)}>
              <FaEllipsisV />
            </button>
            {activeMenuId === user.id && (
              <div className="dropdown-menu">
                                <button
                  onClick={() => {
                    handleSendToTexnika(user);
                    setActiveMenuId(null); // Menyuni yopish
                  }}
                >
                  Направить в эксплуатации
                </button>
                <button
                  onClick={() => {
                    handleSendToRepair(user);
                    setActiveMenuId(null); // Menyuni yopish
                  }}
                >
                  Направить в ремонт
                </button>
                <button
                  onClick={() => {
                    handleUpdate(user);
                    setActiveMenuId(null); // Menyuni yopish
                  }}
                >
                  Редактировать
                </button>
                <button
                onClick={() => {
                  handleShowHistory(user);
                  setActiveMenuId(null); // Menyuni yopish
                }}
              >
                История передачи и получения
              </button>
              <button
                onClick={() => {
                  handleShowTexHistory(user);
                  setActiveMenuId(null); // Menyuni yopish
                }}
              >
                История создания и изменений
              </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    ));
    
  };

  const handleShowHistory = (user) => {
    setSelectedUser(user);
    setShowHistory(true);
    setShowTexHistory(false); // Yopish TexHistory
  };

  const handleShowTexHistory = (user) => {
    setSelectedUserHistory(user);
    setShowTexHistory(true);
    setShowHistory(false); // Yopish History
  };

  const handleCloseModal = () => {
    setShowHistory(false);
    setShowTexHistory(false);
    setSelectedUser(null);
    setSelectedUserHistory(null);
  };

  // Sort by Status
  const handleSortStatusClick = (sortField) => {
    setActiveSort(sortField);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedUserUpdate(null);
  };

  const handleModalTexnika = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  
    const data = {
      id: e.id,
      naimenovaniya_tex: e.naimenovaniya_tex,
      inv_tex: e.inv_tex,
      seriyniy_nomer: e.seriyniy_nomer,
      mac_address: e.mac_address,
    };
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${BACK_API}api/updatetexnikaunused`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.status === 403) {
        // Token muddati tugagan bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false); // Xabarni yashirish
          navigate("/"); // Login sahifasiga yo'naltirish
        }, 3000);
        return;
      }
  
      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        setText(result.message || "Texnika muvaffaqiyatli yangilandi");
      } else {
        const errorResult = await response.json();
        setSuccess(false);
        setText(errorResult.message || "Texnikani yangilashda xatolik yuz berdi");
      }
    } catch (error) {
      setSuccess(false);
      setText(error.message || "Texnikani yangilashda xatolik yuz berdi");
    } finally {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload(); // Sahifani qayta yuklash
      }, 3000);
    }
  
    closeModal(); // Modalni yopish
  };

  const renderSuccessMessage = () => {
    if (showSuccess) {
      return <Referense title={text} background={success} />;
    }
  };


  return (
    <div className="users-container">
      <div className="users-header">
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

        <div className="controls">
          <div className="dropdown">
            <button className="icon-button">
              <FaFilter />
            </button>
            <div className="dropdown-menu">
              <a href="#!" onClick={() => handleSortStatusClick("naimenovaniya_tex")}>
                Наименования тех
              </a>
              <a href="#!" onClick={() => handleSortStatusClick("inv_tex")}>
                ИНВ номер
              </a>
              <a href="#!" onClick={() => handleSortStatusClick("seriyniy_nomer")}>
                Серийный номер
              </a>
              <a href="#!" onClick={() => handleSortStatusClick("mac_address")}>
                Mac address
              </a>
            </div>
          </div>
        </div>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Наименования тех</th>
            <th>ИНВ номер</th>
            <th>Серийный номер</th>
            <th>Mac addres</th>
            <th>Дата</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{acceptionTable()}</tbody>
      </table>

      {showHistory && selectedUser && (
        <History user={selectedUser} closeModal={handleCloseModal} />
      )}

      {showTexHistory && selectedUserHistory && (
        <Texhistory user={selectedUserHistory} closeModal={handleCloseModal} />
      )}

      {selectedUserUpdate && (
        <UpdateModalTexnika
          show={true}
          user={selectedUserUpdate}
          onClose={closeModal}
          onSubmit={handleModalTexnika}
        />
      )}

      {renderSuccessMessage()}
    </div>
  );
}
