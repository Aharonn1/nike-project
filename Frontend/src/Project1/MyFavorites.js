import React, { useState, useEffect } from "react";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import { Link } from "react-router-dom";

function MyFavorites(props) {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [favorites, setFavorites] = useState([]);
  const [isLiked, setIsLiked] = useState(false); // state למעקב אחר סטטוס הלייק

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userFavorites = await dataService.getAllFavoritesByUser(
          loggedInUser.userData
        );
        console.log("userFavorites", userFavorites);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("שגיאה בטעינת ה-favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleLike = async (favorite) => {
    try {
      await dataService.removeFavorite(loggedInUser.userData, favorite); // משתמשים ב-favorite
      const updatedShoes = favorites.filter(
        (shoe) => shoe.shoesId !== favorite
      );
      console.log("updatedShoes", updatedShoes);
      setFavorites(updatedShoes);
      setIsLiked(false);
    } catch (error) {
      console.error("שגיאה:", error);
    }
  };

  return (
    <div>
      <div className="product-tabs">
        {favorites.map((favorite) => (
          <div key={favorite.shoesId} className="product-tab">
            <h2>{favorite.title}</h2>
            <Link to={`/shoesUsers/${favorite.shoesId}`}>
              <img src={appConfig.shoesImagesUsersUrl + favorite.imageName} />
            </Link>
            <p>Price: {favorite.price} ₪</p>
            <p>Category: {favorite.categoryName}</p>
            <p>Description: {favorite.description}</p>
            <p>Stock: {favorite.stock}</p>
            <p>Bought: {favorite.bought ? favorite.bought : 0}</p>
            <p>Likes: {favorite.global_total_favorites || 0}</p>{" "}
            <button
              className="handleToggleLike"
              onClick={() => handleToggleLike(favorite.shoesId)}
            >
              {" "}
              Delete like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFavorites;