import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import { Link } from "react-router-dom";

function MyFavorites(props) {
  const [favorites, setFavorites] = useState([]);
  const [shoppingBasketCount, setShoppingBasketCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [totalPrice1, setTotalPrice1] = useState(0); // State for total price
  const [titleName, setTitleName] = useState(""); // State for total price
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [shoe, setShoe] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // state למעקב אחר סטטוס הלייק
  const [showButton, setShowButton] = useState(false); // state למעקב אחר סטטוס הלייק
  const [refreshFavorites, setRefreshFavorites] = useState(false);

  const params = useParams();
  const Basket = 1;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const userFavorites = await dataService.getAllFavoritesByUser(
          loggedInUser.userData
        ); // קריאה לפונקציה מה-service
        console.log("userFavorites", userFavorites);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("שגיאה בטעינת ה-favorites:", error);
        // טיפול בשגיאה, למשל הצגת הודעה למשתמש
      }
    };

    fetchFavorites();
  }, []);

  async function deleteOrder(shoeId) {
    if (props.lastOrder && props.lastOrder.shoesId === shoeId.shoesId) {
      console.warn("No last order found to delete.");
      return;
    }

    try {
      let localShoppingBasket = shoeId.shoppingBasket
        ? shoeId.shoppingBasket
        : 0;
      const shoesId = shoeId.shoesId;
      let orders1 = await dataService.getAllOrders2();
      const filteredOrders = orders1.filter(
        (order) => order.shoesId === shoesId
      );
      let lastOrder = filteredOrders.slice(-1)[0]; // לוקח את האלמנט האחרון במערך החדש
      console.log("filteredOrders", filteredOrders);
      const orderToDelete = filteredOrders.find((order) => {
        return order.orderId === lastOrder.orderId;
      });

      console.log(filteredOrders);
      console.log("Basket", Basket);
      if (
        filteredOrders &&
        shoppingBasketCount > 0 &&
        localShoppingBasket > 0
      ) {
        const updateStock = loggedInUser.userData.updateStock;

        if (Basket > 0 && updateStock === 1) {
          console.log("shoes", shoeId.stock++);
          console.log("shoes", shoeId.bought--);
        }
        if (updateStock === 1) {
          await dataService.deleteOrder(orderToDelete.orderId);
        } else {
          await dataService.deleteOrder1(orderToDelete.orderId);
        }
        localShoppingBasket--;

        const updatedCartItems = [...cartItems];
        console.log("cartItems", cartItems);
        if (updatedCartItems) {
          console.log("localShoppingBasket", localShoppingBasket);
          const updatedCartItems = [...cartItems];
          const existingItemIndex = updatedCartItems.findIndex(
            (item) => item.shoesId === shoeId.shoesId
          );
          if (existingItemIndex !== -1) {
            updatedCartItems[existingItemIndex].shoppingBasket--;
          } else {
            updatedCartItems.push({ ...shoeId, shoppingBasket: 1 });
          }
          // setCartItems(updatedCartItems);
          const total = updatedCartItems.reduce(
            (acc, item) => acc + item.price * item.shoppingBasket,
            0
          );
          console.log("newTotalPrice", total);
          // setCartItems(updatedCartItems);
          console.log("updatedCartItems", updatedCartItems);
          setTitleName(titleName);
          setTotalPrice1(total); // ודא שאתה משתמש ב-newTotalPrice כאן!
          setShoppingBasketCount(shoppingBasketCount - 1);
        }
      }
      shoeId.shoppingBasket = localShoppingBasket;
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const handleAddToCart = async (shoe) => {
    const userId = loggedInUser.userData.userId;
    const updateStock = loggedInUser.userData.updateStock;
    if (updateStock > 0) {
      console.log("shoes", shoe.stock--);
      console.log("shoes", shoe.bought++);
    }
    console.log("userId", userId);
    console.log("updateStock", updateStock);
    const shoesId = shoe.shoesId;
    const quantity = 1;
    const title = shoe.title;
    let orders = await dataService.getAllOrders2();
    console.log("orders", orders);

    let localShoppingBasket = shoe.shoppingBasket ? shoe.shoppingBasket : 0;

    try {
      if (updateStock === 1) {
        const response = await dataService.handleOrder(
          userId,
          shoesId,
          quantity
        );
        console.log("response", response);
        await dataService.getAllShoes();
      } else {
        const response1 = await dataService.handleOrder1(
          userId,
          shoesId,
          quantity
        );
        console.log("response1", response1);
      }
      localShoppingBasket++;

      console.log(localShoppingBasket);
      setShoppingBasketCount(shoppingBasketCount + 1);
      const updatedCartItems = [...cartItems];
      console.log("updatedCartItems", updatedCartItems);
      const existingItemIndex = updatedCartItems.findIndex(
        (item) => item.shoesId === shoe.shoesId
      );
      if (existingItemIndex !== -1) {
        updatedCartItems[existingItemIndex].shoppingBasket++;
      } else {
        updatedCartItems.push({ ...shoe, shoppingBasket: 1 });
      }
      setCartItems(updatedCartItems);
      console.log("updatedCartItems", updatedCartItems);
      const total = updatedCartItems.reduce(
        (acc, item) => acc + item.price * item.shoppingBasket,
        0
      );
      // console.log("orderedShoes", orderedShoes);
      console.log("total", total);
      const newCartItems = [...cartItems, shoe]; // Add the new item to the cart
      console.log("newCartItems", newCartItems);

      setTitleName(titleName);
      setTotalPrice1(total);
      setIsCartUpdated(true);
      // setStock(stock - quantity);
      // setBought(bought + quantity);
    } catch (error) {
      console.log("Order failed:", error);
    }

    shoe.shoppingBasket = localShoppingBasket;
    await dataService.getAllOrders2();
    // refreshShoes();
  };

  const handleToggleLike = async (favorite) => {
    // מוסיפים shoeId כפרמטר
    try {
      //   if (isLiked) {
      await dataService.removeFavorite(loggedInUser.userData, favorite); // משתמשים ב-favorite
      const updatedShoes = favorites.filter(
        (shoe) => shoe.shoesId !== favorite
      ); // מסננים את הנעל מהמערך
      console.log("updatedShoes", updatedShoes);
      setFavorites(updatedShoes);
      setIsLiked(false);

      //   }
    } catch (error) {
      console.error("שגיאה:", error);
    }
  };

  return (
    <div>
      <div className="product-tabs">
        {/* <div className="item1"> */}
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
            <p>Likes: {favorite.global_total_favorites || 0}</p>
                    {" "}
                    {/* שנה את הנתיב לפי הצורך */}
                   
            <button
              className="handleToggleLike"
              onClick={() => handleToggleLike(favorite.shoesId)}
              >
              {" "}
              {/* מעבירים את shoe.id לפונקציה */}
             Delete like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFavorites;
