import { Link } from "@tanstack/react-router";
import React from "react";

export const NavBarUsers = () => {
    return (
        <nav style={navContainerStyle}>
            {/* לוגו או שם המותג בצד שמאל (אופציונלי) */}
            <div style={logoStyle}>SNKR STORE</div>

            {/* הקישורים המרכזיים */}
            <div style={navLinksWrapperStyle}>
                <Link to="/user/shoesUsers" style={linkStyle} activeProps={{ style: activeLinkStyle }}>
                    Products
                </Link>
                <Link to="/user/ordersUsers" style={linkStyle} activeProps={{ style: activeLinkStyle }}>
                    My Orders
                </Link>
                <Link to="/user/myAccount" style={linkStyle} activeProps={{ style: activeLinkStyle }}>
                    My Account
                </Link>
                <Link to="/user/myFavorites" style={linkStyle} activeProps={{ style: activeLinkStyle }}>
                    My Favorites
                </Link>
            </div>

            {/* שטח ריק לאיזון או לחיפוש עתידי */}
            <div style={{ width: "120px" }}></div>
        </nav>
    );
};

/* --- סגנונות Premium --- */

const navContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    fontFamily: "'Inter', sans-serif",
};

const logoStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "-1px",
    color: "#000",
    cursor: "pointer",
};

const navLinksWrapperStyle: React.CSSProperties = {
    display: "flex",
    gap: "35px", // במקום &nbsp; - רווח אחיד ומדויק
    alignItems: "center",
};

const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#111",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    position: "relative",
    padding: "5px 0",
};

// אפקט הקו מתחת לקישור פעיל
const activeLinkStyle: React.CSSProperties = {
    color: "#000",
    borderBottom: "2px solid #000",
};

export default NavBarUsers;