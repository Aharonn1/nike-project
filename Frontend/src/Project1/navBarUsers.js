import { Link,useLocation } from "react-router-dom";
import React, { useRef } from "react";

export const NavBarUsers = ({ onLogout }) => {
  const videoRef = useRef(null);
    const location = useLocation();

  const shouldShowNavBar = location.pathname !== "/navBarUsers";

  return (
    <nav>
      
      <div className="nav-links">
        <Link to="/shoesUsers">Products</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/ordersUsers"> My Orders</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/myAccount"> My Account</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/myFavorites"> My Favorites</Link>
      </div>
      <video
        ref={videoRef} 
        src="https://www.shutterstock.com/shutterstock/videos/3573601179/preview/stock-footage-rome-italy-august-large-screen-projecting-images-of-the-symbol-of-the-american.webm"
        controls
        autoPlay
        muted
        loop
        width="100%"
        controlsList="nodownload nofullscreen noremoteplayback"
      ></video>
    </nav>
  );
};