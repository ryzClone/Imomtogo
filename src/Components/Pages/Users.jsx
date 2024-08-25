import React, { useContext, useEffect, useState } from "react";
import {
  FaSort,
  FaFilter,
  FaUserPlus,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "../style/Users.css"; // CSS faylingiz
import Addusermodal from "./Addusermodal";
import Referense from "./Referense";
import { UserContext } from "./userContex";

export default function Users() {
  const { search } = useContext(UserContext);
  // pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(100);
  const [users, setUsers] = useState([]);

  // addusermodal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // messageModal
  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);

  // Search and sort
  const [globSearch, setGlobSearch] = useState("");
  const [sortRole, setSortRole] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [activeSort, setActiveSort] = useState(null);

  // useEffect
  useEffect(() => {
    readUser();
    setGlobSearch(search || "");
  }, [page, size, sortRole, sortStatus, search, globSearch]);

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

  // adduser Fetch
  const handleAddUserSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      role: formData.get("role"),
      status: formData.get("status"),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        setText(result.message || "User added successfully!");
      } else {
        const errorResult = await response.json();
        setSuccess(false);
        setText(errorResult.message || "Failed to add user");
      }
    } catch (error) {
      setSuccess(false);
      setText(error.message || "An error occurred while adding user");
    } finally {
      setShowSuccess(true);
      setIsModalOpen(false);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 3000);
    }
  };

  // render message
  const renderSuccessMessage = () => {
    if (showSuccess) {
      return <Referense title={text} background={success} />;
    }
  };

  // read Users
  const readUser = async () => {
    const data = {
      page: page,
      size: size,
      search: globSearch,
      status: sortStatus,
      role: sortRole,
    };
    try {
      const token = localStorage.getItem("token");

      // URL parametrlarini formatlash
      const queryParams = new URLSearchParams(data).toString();

      const response = await fetch(
        `http://localhost:5000/api/readuser?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data);
        setTotal(result.total);
        // setSuccess(true);
        // setText(result.message || "Users retrieved successfully");
      } else {
        const errorResult = await response.json();
        // setSuccess(false);
        // setText(errorResult.message || "Failed to fetch users");
      }
    } catch (error) {
      setSuccess(false);
      setText(error.message || "An error occurred while fetching users");
    }
    // finally {
    //   setShowSuccess(true);
    //   setTimeout(() => {
    //     setShowSuccess(false);
    //   }, 3000);
    // }
  };

  // Update users
  const handleUpdate = () => {};
  // Delate users
  const handleDelete = () => {};

  // Edit active
  const handleToggleChange = async (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "disabled" : "active" }
        : user
    );

    const updatedUser = updatedUsers.find((user) => user.id === userId);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/editstatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId, status: updatedUser.status }), // id ni ham jo'natamiz
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Muvaffaqiyatli bo'lsa, foydalanuvchilar ro'yxatini yangilash
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user status:", error);

      // API so'rov muvaffaqiyatsiz bo'lsa, statusni qaytarib qo'yish
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === "active" ? "disabled" : "active",
              }
            : user
        )
      );
    }
  };
  // user table
  const usersTable = () => {
    return users.map((user, index) => (
      <tr key={user.id}>
        <td>{index + 1}</td>
        <td>{user.username}</td>
        <td>{`******`}</td>
        <td>{user.role}</td>
        <td>{user.status}</td>
        <td>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id={`toggle-${user.id}`}
              checked={user.status === "active"}
              onChange={() => handleToggleChange(user.id)}
              className="toggle-checkbox"
            />
            <label htmlFor={`toggle-${user.id}`} className="toggle-label">
              <span className="slider"></span>
            </label>
          </div>
        </td>
        <td>{user.date}</td>
        <td className="edit-btns">
          <button onClick={() => handleUpdate(user.id)}>
            <FaEdit className="edit-btns-icon" />
          </button>
          <button onClick={() => handleDelete(user.id)}>
            <FaTrash className="edit-btns-icon" />
          </button>
        </td>
      </tr>
    ));
  };

  // active sort
  const handleSortRoleClick = () => {
    if (activeSort !== "role") {
      setActiveSort("role");
      setSortRole("ADMIN");
      setSortStatus("");
    }
  };

  const handleSortStatusClick = () => {
    if (activeSort !== "status") {
      setActiveSort("status");
      setSortStatus("active");
      setSortRole("");
    }
  };
  const handleSortAllClick = () => {
    if (activeSort !== "all") {
      setActiveSort("");
      setSortStatus("");
      setSortRole("");
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

          <div className="pagination-total">total: {total}</div>
        </div>

        <div className="controls">
          <div className="dropdown">
            <button className="icon-button">
              <FaFilter />
            </button>
            <div className="dropdown-menu">
              <a href="#/action-1" onClick={handleSortRoleClick}>
                Sort role
              </a>
              <a href="#/action-2" onClick={handleSortStatusClick}>
                Sort status
              </a>
              <a href="#/action-2" onClick={handleSortAllClick}>
                All
              </a>
            </div>
          </div>
          <button
            className="add-user-button"
            onClick={() => setIsModalOpen(true)}
          >
            <FaUserPlus /> Add user
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="add-user-modal-overlay">
          <Addusermodal
            show={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddUserSubmit}
          />
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Status</th>
            <th>Status change</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{usersTable()}</tbody>
      </table>
      {renderSuccessMessage()}
    </div>
  );
}
