import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import dataService from "../Service/DataService";

export const NavBar = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userFavorites = await dataService.getAllImages();
        console.log("userFavorites", userFavorites);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("שגיאה בטעינת ה-favorites:", error);
      }
    };
    fetchFavorites();
  }, []);


  
  return (
    <div className="auth-links">
        
      <Link to="/Login">Login</Link>
      <Link to="/Register">Register</Link>
    </div>
  );
};