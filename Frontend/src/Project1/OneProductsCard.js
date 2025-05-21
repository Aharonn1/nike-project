import React, { useState, useEffect, useRef } from "react";
import dataService from "../Service/DataService";
import { useParams } from "react-router-dom";
import appConfig from "../Utils/AppConfig";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

function OneProductsCard(props) {
  const [filteredShoes, setFilteredShoes] = useState(props.shoes);
  const [shoppingBasketCount, setShoppingBasketCount] = useState(0);
  const [lastSelectedSize, setLastSelectedSize] = useState({});
  const [isOrdersUpdated, setIsOrdersUpdated] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [selectedImage, setSelectedImage] = useState(null); // משתנה מצב חדש
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [selectedSizes1, setSelectedSizes1] = useState({}); // אובייקט לשמירת מידות לכל נעל
  const [shoeSizeStock, setShoeSizeStock] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const [totalPrice1, setTotalPrice1] = useState(0); // State for total price
  const [stockData1, setStockData1] = useState([]);
  const [showCart, setShowCart] = useState(false); // State for cart visibility
  const [totalPrice, setTotalPrice] = useState([]);
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [titleName, setTitleName] = useState(""); // State for total price
  const [stockData, setStockData] = useState([]);
  const [isLiked, setIsLiked] = useState(false); // state למעקב אחר סטטוס הלייק
  const [comments, setComments] = useState([]); // State for cart items
  const [orders, setOrders] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [shoe, setShoe] = useState(null);
  const closeCartRef = useRef(null); // Ref for the close button
  const playerRef = useRef(null);
  const params = useParams();
  const Basket = 1;
  useEffect(() => {
    const fetchShoeData = async () => {
      try {
        const response = await dataService.getShoeById(+(params.shoesId || 0));
        console.log("response", response);
        const response1 = await dataService.getAllSizes();
        const response2 = await dataService.getAllOrders2(
          loggedInUser.userData.userId
        );
        console.log("response2", response2);
        const comments = await dataService.getAllComments(
          +(params.shoesId || 0)
        );
        console.log("comments", comments);
        setComments(comments);

        const stockData1 = await dataService.getAllShoesSizes1();
        console.log("stockData1", stockData1);
        const stockData = await dataService.getAllShoesSizes(response.shoesId);
        console.log("stockData", stockData);
        setShoeSizeStock(stockData);
        setStockData(stockData);

        const filteredOrders = response2.filter(
          (order) =>
            order.userId === loggedInUser.userData.userId && order.status === 0
        );
        console.log("filteredOrders", filteredOrders);
        const totalPrice = filteredOrders.reduce(
          (sum, order) => sum + order.price,
          0
        );
        const groupedOrders = filteredOrders.reduce((acc, order) => {
          const existingOrder = acc.find(
            (item) =>
              item.shoesId === order.shoesId && item.sizeId === order.sizeId
          );
          if (existingOrder) {
            existingOrder.quantity += 1;
          } else {
            acc.push({ ...order, quantity: 1 });
          }
          return acc;
        }, []);

        console.log("groupedOrders", groupedOrders);
        const updatedCartItems = [...filteredOrders];
        console.log("updatedCartItems", updatedCartItems);
        console.log("totalPrice", totalPrice);
        console.log("filteredOrders", filteredOrders);
        setTotalPrice(totalPrice);
        console.log(response1);
        setSizes(response1);
        setShoe(response);
        setSelectedSizes1(response.shoesId);
        setOrders(filteredOrders);
        setOrders(groupedOrders);
        setStockData1(stockData1);
        
      } catch (error) {
        console.error("שגיאה בטעינת נתוני הנעל:", error);
      }
    };

    fetchShoeData();
  }, [params.shoesId, isOrdersUpdated]);

  const toggleCart = () => {
    setShowCart(!showCart); // Toggle cart visibility
  };

  const handleMouseEnter = (imageName) => {
    setSelectedImage(imageName);
    setShowVideo(false);
  };

  const handleToggleLike = async () => {
    try {
      const updatedShoe = { ...shoe };
      if (isLiked) {
        await dataService.removeFavorite(loggedInUser.userData, params.shoesId);
        updatedShoe.total_favorites--;
        setIsLiked(false);
      } else {
        await dataService.addFavorite(loggedInUser.userData, params.shoesId);
        updatedShoe.total_favorites++;
        setIsLiked(true);
      }

      setShoe(updatedShoe);
    } catch (error) {
      console.error("שגיאה:", error);
    }
  };

  const handleVideoMouseEnter = () => {
    setShowVideo(true);
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const handleVideoMouseLeave = () => {
    setShowVideo(false);
    if (playerRef.current && typeof playerRef.current.pause === "function") {
      playerRef.current.pause();
    }
  };

  async function deleteOrder(shoe, orderId) {
    try {
      setIsOrdersUpdated((prev) => !prev);
      let localShoppingBasket =
        shoe.shoesId && shoe.shoppingBasket ? shoe.shoppingBasket : 0;
      console.log("localShoppingBasket", localShoppingBasket);
      const response2 = await dataService.getAllOrders();
      console.log("response2", response2);
      const filteredOrders = orders.filter(
        (order) =>
          order.userId === loggedInUser.userData.userId && order.status === 0
      );

      console.log("filteredOrders", filteredOrders);

      if (filteredOrders.length === 0) {
        console.warn("No orders found to delete.");
        return;
      }

      const orderToDelete = filteredOrders.find(
        (order) => order.orderId === orderId
      );

      console.log("orderToDelete", orderToDelete);
      if (!orderToDelete) {
        console.warn("Order not found.");
        return;
      }

      if (
        filteredOrders ||
        shoppingBasketCount > 0 ||
        localShoppingBasket > 0
      ) {
        const updateStock = loggedInUser.userData.updateStock;

        if (updateStock === 1) {
          await dataService.deleteOrder(orderToDelete.orderId);
        } else {
          await dataService.deleteOrder1(orderToDelete.orderId);
        }
        const updatedCartItems = [...cartItems];
        console.log("updatedCartItems", updatedCartItems);

        setCartItems((prevCartItems) => {
          const updatedCartItems = [...prevCartItems];
          const existingItemIndex = updatedCartItems.findIndex(
            (item) => item.shoesId === shoe.shoesId
          );
          if (existingItemIndex !== -1) {
            if (updatedCartItems[existingItemIndex].shoppingBasket > 1) {
            } else {
              updatedCartItems.splice(existingItemIndex, 1);
            }
          }
          return updatedCartItems;
        });

        if (Basket > 0 && updateStock === 1) {
          shoe.stock++;
          shoe.bought--;
        }

        const total = cartItems.reduce(
          (acc, item) => acc + item.price * item.shoppingBasket,
          0
        );

        setTotalPrice1(total);

        setShoe((prevShoe) => ({
          ...prevShoe,
          stock: prevShoe.stock + (Basket > 0 && updateStock === 1 ? 1 : 0),
          bought: prevShoe.bought - (Basket > 0 && updateStock === 1 ? 1 : 0),
        }));

        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        const updatedOrders = orders.filter(
          (order) => order.orderId !== orderId
        );
        const newTotalPrice = updatedOrders.reduce(
          (sum, order) => sum + order.price,
          0
        );

        setTotalPrice(newTotalPrice);
        setTitleName(titleName);
        if (
          shoe.shoesId &&
          cartItems.some((item) => item.shoesId === shoe.shoesId)
        ) {
          console.log("cartItems", cartItems);
          console.log("shoe.shoesId", shoe.shoesId);
          setShoppingBasketCount((prevCount) => prevCount - 1); // Use functional update
        }

        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        setIsOrdersUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const handleSizeChange = (shoeId, sizeId) => {
    setSelectedSizes1((prevSizes) => ({
      ...prevSizes,
      [shoeId]: sizeId,
    }));
  };

  const handleAddToCart = async (shoe, isFromCart = false) => {
    console.log("shoe", shoe);
    const userId = loggedInUser.userData.userId;
    const updateStock = loggedInUser.userData.updateStock;
    console.log("userId", userId);
    console.log("updateStock", updateStock);
    const shoesId = shoe.shoesId;
    const quantity = 1;

    let localShoppingBasket = shoe.shoppingBasket ? shoe.shoppingBasket : 0;

    try {
      const response2 = await dataService.getAllOrders();
      const filteredOrders = response2.filter(
        (order) =>
          order.userId === loggedInUser.userData.userId && order.status === 0
      );

      console.log("selectedSizes1:", selectedSizes1);
      console.log("filteredOrders:", filteredOrders);

      if (isFromCart) {
        setLastSelectedSize((prevSizes) => ({
          ...prevSizes,
          [shoe.shoesId]: shoe.sizeId,
        }));
      }

      const existingItemIndex = filteredOrders.findIndex(
        (item) => item.shoesId === shoe.shoesId 
      );
      console.log("existingItemIndex" , existingItemIndex)
      let sizeIdToUse;

      if (existingItemIndex !== -1) {
        sizeIdToUse = filteredOrders[existingItemIndex].sizeId;
        console.log("sizeIdToUse" , sizeIdToUse)
        console.log("מידה מהסל:", sizeIdToUse);
      } else {
        sizeIdToUse = selectedSizes1[shoe.shoesId] || shoe.sizeId;
        console.log("מידה חדשה:", sizeIdToUse);
      }
      
      const selectedSizeStock =
        stockData1.find(
          (item) => item.sizeId === sizeIdToUse && item.shoesId === shoesId
        )?.stock || 0;
      console.log("selectedSizeStock", selectedSizeStock);
      if (selectedSizeStock === 0) {
        alert("אין מספיק מלאי עבור מידה זו.");
        return;
      }

      if (updateStock > 0) {
        console.log("shoes", shoe.stock--);
        console.log("shoes", shoe.bought++);
      }

      if (updateStock === 1) {
        const response = await dataService.handleOrder(
          userId,
          shoesId,
          quantity,
          sizeIdToUse
        );
        await dataService.getAllShoes();
      } else {
        const response1 = await dataService.handleOrder1(
          userId,
          shoesId,
          quantity,
          sizeIdToUse
        );
        console.log("response1", response1);
      }

      const updatedCartItems = [...cartItems, shoe];
      console.log("updatedCartItems", updatedCartItems);

      setCartItems(updatedCartItems);
      localShoppingBasket++;

      setShoe((prevShoe) => ({
        ...prevShoe,
        shoppingBasket: localShoppingBasket,
      }));

      setShoppingBasketCount(shoppingBasketCount + 1);
      setCartItems(updatedCartItems);
      console.log("updatedCartItems", updatedCartItems);
      const total = updatedCartItems.reduce(
        (acc, item) => acc + item.price * item.shoppingBasket,
        0
      );
      console.log("total", total);

      const newCartItems = [...filteredOrders, shoe]; // Add the new item to the cart
      console.log("newCartItems", newCartItems);

      setTitleName(titleName);
      setTotalPrice1(total);
      setIsCartUpdated(true);
      // setStockData1(stockData1);
    } catch (error) {
      console.error("שגיאה:", error);
    }

    setIsOrdersUpdated((prev) => !prev);
  };

  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    try {
      if (!newComment) {
        alert("יש להזין תגובה");
        return;
      }

      const comment = {
        userId: loggedInUser.userData.userId,
        shoesId: shoe.shoesId,
        commentText: newComment,
      };

      await dataService.addComment(comment);
      setNewComment(""); // איפוס תיבת הקלט
      const updatedComments = await dataService.getAllComments(shoe.shoesId);
      setComments(updatedComments);
    } catch (error) {
      console.error("שגיאה בהוספת תגובה:", error);
    }
  };

  const handleSizeClick = (sizeId) => {
    handleSizeChange(shoe.shoesId, sizeId);
  };

  return (
    <div className="listProduct">
      <div className="svg-container" onClick={toggleCart}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>
      </div>
      {shoe ? (
        <div className="container">
          <div className="side-images">
            <div
              className="side-image"
              onMouseEnter={handleVideoMouseEnter}
              onMouseLeave={handleVideoMouseLeave}
            >
              <img
                className="react-player-video"
                src={appConfig.shoesImagesUsersUrl + shoe.imageName}
                alt="Front"
              />
              <FaPlay className="play-icon" />
            </div>

            <div
              className="side-image"
              onMouseEnter={() => handleMouseEnter(shoe.imageNameFront)}
            >
              <img
                src={appConfig.shoesImagesUsersUrl + shoe.imageNameFront}
                alt="front-side"
              />
            </div>
            <div
              className="side-image"
              onMouseEnter={() => handleMouseEnter(shoe.imageNameAbove)}
            >
              <img
                src={appConfig.shoesImagesUsersUrl + shoe.imageNameAbove}
                alt="above-side"
              />
            </div>

            <div
              className="side-image"
              onMouseEnter={() => handleMouseEnter(shoe.imageNameBack)}
            >
              <img
                src={appConfig.shoesImagesUsersUrl + shoe.imageNameBack}
                alt="back-side"
              />
            </div>

            <div
              className="side-image"
              onMouseEnter={() => handleMouseEnter(shoe.imageNameDown)}
            >
              <img
                src={appConfig.shoesImagesUsersUrl + shoe.imageNameDown}
                alt="down-side"
              />
            </div>
          </div>
          <div className="main-image">
            {showVideo ? (
              <ReactPlayer
                ref={playerRef}
                url={appConfig.shoesImagesUsersUrl + shoe.video}
                playsinline
                controls
                playing={showVideo}
                muted
                width="190%"
                height="auto"
                preload="auto"
              />
            ) : selectedImage ? (
              <img
                src={appConfig.shoesImagesUsersUrl + selectedImage}
                alt={shoe.title}
              />
            ) : (
              <img
                src={appConfig.shoesImagesUsersUrl + shoe.imageName}
                alt={shoe.title}
              />
            )}

            <div className="item1">
              <h2>{shoe.title}</h2>
              <p>Price: {shoe.price} ₪</p>
              <p>Category: {shoe.categoryName}</p>
              <p>Description: {shoe.description}</p>
              <p>Stock: {shoe.stock}</p>
              <button
                className="addCart"
                onClick={() => handleAddToCart(shoe, selectedSizes1)}
              >
                {" "}
                ➕{" "}
              </button>

              <div className="quantity">{shoppingBasketCount}</div>
              <button
                onClick={() => {
                  const orderToDelete = orders.find(
                    (order) => order.shoesId === shoe.shoesId
                  );
                  if (orderToDelete) {
                    deleteOrder(shoe, orderToDelete.orderId);
                  } else {
                    console.warn("Order not found in orders array.");
                  }
                }}
              >
                ➖
              </button>
              <p>Bought: {shoe.bought}</p>

              <div
                className="sizes-container"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "5px",
                }}
              >
                {stockData.map((size) => (
                  <p
                    key={size.sizeId}
                    onClick={() => {
                      handleSizeClick(size.sizeId);
                      setLastSelectedSize(size.sizeId);
                    }}
                    className={
                      selectedSizes1[shoe.shoesId] === size.sizeId
                        ? "selected"
                        : ""
                    }
                    style={{
                      backgroundColor:
                        size.stock === 0
                          ? "gray"
                          : lastSelectedSize === size.sizeId
                          ? "blue"
                          : "initial",
                    }}
                  >
                    {size.sizeId}
                  </p>
                ))}
              </div>
              <button className="Favorite" onClick={handleToggleLike}>
                {isLiked ? "UnFavorite" : "Favorite"}
              </button>
              <p>Likes: {shoe.total_favorites || 0}</p>
              <div className="comments-container">
                <h2>Comments ({comments ? comments.length : 0})</h2>{" "}
                {/* הצגת מספר התגובות */}
                {comments && comments.length > 0 ? (
                  <ul>
                    {comments.map((comment) => (
                      <li key={comment.commentId}>
                        <strong>
                          {comment.firstName} {comment.lastName}
                          <br />
                        </strong>{" "}
                        {comment.commentText}
                        <br />
                        <span className="comment-date">
                          {new Date(comment.commentDate).toLocaleDateString(
                            "he-IL"
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments.</p>
                )}
                {/* הוספת תיבת קלט להוספת תגובה */}
                {loggedInUser && loggedInUser.userData ? (
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>הוסף</button>
                  </div>
                ) : (
                  <p>יש להתחבר כדי להוסיף תגובה.</p>
                )}
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : (
        <p>Loading shoe...</p>
      )}
      {showCart && (
        <div className="cartTab1">
          <h1>Shopping Cart</h1>
          {orders.length > 0 ? (
            <div className="listCart">
              {orders.map((cartItem, index) => (
                <div
                  key={`${cartItem.sizeId}-${cartItem.sizeId}-${index}`}
                  className="cart-box"
                >
                  <div className="cartItem2">
                    <br />
                    <div className="details">
                      <div className="name">Name: {cartItem.title}</div>
                      <div className="quantity">
                        Quantity: {cartItem.quantity}
                      </div>
                      <div className="size">Size: {cartItem.sizeId}</div>
                      <div className="price">Price: {cartItem.price}</div>
                    </div>
                    <Link to={`/shoesUsers/${cartItem.shoesId}`}>
                      <img
                        src={appConfig.shoesImagesUsersUrl + cartItem.imageName}
                        alt={cartItem.title}
                      />
                    </Link>
                    <button
                      className="addCart"
                      onClick={() => handleAddToCart(cartItem, selectedSizes1)}
                    >
                      {" "}
                      ➕{" "}
                    </button>
                    <button onClick={() => deleteOrder(shoe, cartItem.orderId)}>
                      ➖
                    </button>
                  </div>
                </div>
              ))}
              <p className="totalPrice">
                Total Price : {totalPrice} ₪
                <br />
                Total Shoes :{" "}
                {orders.reduce((sum, order) => sum + order.quantity, 0)}
              </p>
              <br />
              <Link to="/creditCardForm">
                <button className="buy1">Buy</button>
              </Link>
            </div>
          ) : (
            <p>Your shopping cart is empty.</p>
          )}
          <div className="btn">
            <button className="close" ref={closeCartRef} onClick={toggleCart}>
              Close
            </button>
            <button>
              <div className="shoesUsers">
                <Link to="/shoesUsers">Check Out</Link>
              </div>
            </button>
          </div>
        </div>
      )}
      <br /> <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default OneProductsCard;
