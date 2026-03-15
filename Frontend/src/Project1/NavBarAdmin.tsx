import { Link } from "@tanstack/react-router";
import React from "react";
import { FaCogs } from "react-icons/fa";

export const NavBarAdmin = () => {
  return (
    <nav className="admin-navbar">
      <style>{navStyles}</style>
      
      <div className="nav-container">
        {/* עטיפת הלוגו כדי לאפשר מרכוז */}
        <div className="nav-side-wrapper">
          <div className="nav-logo">
            <FaCogs className="logo-icon" />
            <span>NIKE <small>ADMIN</small></span>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/admin/categoryshoes" activeProps={{ className: "active" }}>Categories</Link>
          <Link to="/admin/shoes" activeProps={{ className: "active" }}>Products</Link>
          <Link to="/admin/users" activeProps={{ className: "active" }}>Users</Link>
          <Link to="/admin/mySales" activeProps={{ className: "active" }}>Sales</Link>
          <Link to="/admin/all-users" activeProps={{ className: "active" }}>Orders</Link>
          <Link to="/admin/mySupply" activeProps={{ className: "active" }}>Supply</Link>
          <Link to="/admin/repeatOrders" activeProps={{ className: "active" }}>Returns</Link>
          <Link to="/admin/ordersPerMonth" activeProps={{ className: "active" }}>Monthly</Link>
          <Link to="/admin/userExperience" activeProps={{ className: "active" }}>Reviews</Link>
          <Link to="/admin/graphs" activeProps={{ className: "active" }}>Analytics</Link>
        </div>

        {/* צד ימין ריק כדי לדחוף את התפריט לאמצע */}
        <div className="nav-side-wrapper right"></div>
      </div>
    </nav>
  );
};

const navStyles = `
  .admin-navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    height: 80px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #f0f0f0;
    padding: 0 2%;
    font-family: 'Inter', sans-serif;
  }

  .nav-container {
    width: 100%;
    max-width: 1700px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* 🎯 התיקון למרכוז: שני הצדדים תופסים מקום שווה */
  .nav-side-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }
  .nav-side-wrapper.right {
    justify-content: flex-end;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 900;
    font-size: 1.4rem;
    letter-spacing: -1px;
    color: #000;
    white-space: nowrap;
  }

  .logo-icon { color: #f39c12; font-size: 1.6rem; }
  .nav-logo small { font-size: 0.6rem; background: #000; color: #fff; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-left: 5px; }

  .nav-links {
    display: flex;
    gap: 5px;
    background: #f8f9fa;
    padding: 6px;
    border-radius: 15px;
    border: 1px solid #eee;
    /* מוודא שהתפריט לא יתכווץ */
    flex-shrink: 0; 
  }

  .nav-links a {
    text-decoration: none;
    color: #666;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 10px 18px;
    border-radius: 10px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .nav-links a:hover {
    color: #000;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .nav-links a.active {
    background: #000;
    color: #fff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 1300px) {
    .nav-links a { padding: 8px 12px; font-size: 0.75rem; }
  }
`;

export default NavBarAdmin;