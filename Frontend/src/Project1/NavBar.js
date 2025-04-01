import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";

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