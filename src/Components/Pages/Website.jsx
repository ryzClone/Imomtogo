// Website.js
import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../style/Website.css";
import logo from "../../images/svg/logo.svg";
import UsersIcon from "../../images/png/users.png";
import Accepted from "../../images/png/accepted.png";
import Transfers from "../../images/png/transfers.png";
import { UserContext } from "./userContex";

function Website() {
  const navigate = useNavigate();
  const location = useLocation();
  const [display, setDisplay] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageTitleMap = {
    users: "Users page",
    transfers: "Transfers page",
    "/website/editpassword": "Edit password ",
    "/website": "Accepted page",
  };

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const title = Object.keys(pageTitleMap).find((key) =>
    location.pathname.includes(key)
  );

  const { setSearch } = useContext(UserContext);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.pathname = "/";
    }
  }, []);

  useEffect(() => {
    const displayDoc = document.querySelector(".user-dropdown");
    if (displayDoc) {
      displayDoc.style.display = display ? "block" : "none";
    }
  }, [display]);

  const handleLogout = () => {
    window.location.pathname = "/";
    localStorage.removeItem("token");
    console.log("Logging out...");
  };

  const toggleDisplay = () => {
    setDisplay((prevDisplay) => !prevDisplay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchTerm);
  };

  return (
    <div className="website-container">
      <header className="website-header">
        <div className="header-content">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
            <div className="logo-container-text">Anorbank DevEX</div>
          </div>
          <nav className="website-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link
                  to="/website"
                  className={`nav-link ${
                    location.pathname === "/website" ? "active" : ""
                  }`}
                >
                  <img
                    src={Accepted}
                    alt="Accepted Icon"
                    className="nav-icon"
                  />
                  <p>Accepted</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/website/transfers"
                  className={`nav-link ${
                    location.pathname === "/website/transfers" ? "active" : ""
                  }`}
                >
                  <img
                    src={Transfers}
                    alt="Transfers Icon"
                    className="nav-icon"
                  />
                  <p>Transfers</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/website/users"
                  className={`nav-link ${
                    location.pathname === "/website/users" ? "active" : ""
                  }`}
                >
                  <img src={UsersIcon} alt="Users Icon" className="nav-icon" />
                  <p>Users</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="website-content">
        <div className="section-content">
          <div className="section-content-title">
            {title ? pageTitleMap[title] : "Default Title"}
          </div>
          <div className="section-content-body">
            <form onSubmit={handleSubmit} className="section-content-body-form">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="section-content-body-user">
              <div className="user-icon" onClick={toggleDisplay}>
                <i className="fas fa-user"></i>
              </div>
              <div className="user-dropdown">
                <ul>
                  <li className="username">
                    Username: <span>{username}</span>
                  </li>
                  <li className="role">
                    Role: <span>{role}</span>
                  </li>
                  <li
                    onClick={() =>
                      (window.location.pathname = "/website/editpassword")
                    }
                  >
                    <i className="fas fa-key"></i>
                    <span>Edit Password</span>
                  </li>
                  <li onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="section-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Website;
