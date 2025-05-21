import { useState, useEffect, useRef } from "react";
import dataService from "../Service/DataService";
import ProductUserCard from "./ProductsUsersCard";
import { useParams } from "react-router-dom";
import appConfig from "../Utils/AppConfig";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Products() {
  const [shoes, setShoes] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastOrder, setLastOrder] = useState(null); // State for last order (optional)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [text, setText] = useState("");
  const [filteredShoes, setFilteredShoes] = useState(shoes); // Initial filteredShoes matches all shoes
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCart, setShowCart] = useState(false); // State for cart visibility
  const [totalPrice, setTotalPrice] = useState([]);
  const closeCartRef = useRef(null); // Ref for the close button
  const [isOrdersUpdated, setIsOrdersUpdated] = useState(false);
  const [shoe, setShoe] = useState(null);
  const [shoppingBasketCount, setShoppingBasketCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [totalPrice1, setTotalPrice1] = useState(0); // State for total price
  const [titleName, setTitleName] = useState(""); // State for total price
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [selectedSizes1, setSelectedSizes1] = useState({}); // אובייקט לשמירת מידות לכל נעל
  const [sizes, setSizes] = useState([]);
  const [stockData1, setStockData1] = useState([]);
  const [filteredShoes1, setFilteredShoes1] = useState([]);
  const [allShoes, setAllShoes] = useState([]); // state עבור כל הנעליים
  const params = useParams();
  const Basket = 1;

  useEffect(() => {
    const fetchShoeData = async () => {
      try {
        const response1 = await dataService.getAllSizes();
        const response3 = await dataService.getAllCategories();
        const response4 = await dataService.getAllShoes();
        const response = await dataService.getShoeById(+(params.shoesId || 0));
        const stockData1 = await dataService.getAllShoesSizes1();
        const response2 = await dataService.getAllOrders2(
          loggedInUser.userData.userId
        );
        console.log("response2", response2);
        console.log("stockData1", stockData1);
        setStockData1(stockData1);
        setShoes(response4.data);
        setAllShoes(response4.data); // שמירת כל הנעליים ב-state
        setFilteredShoes1(response4.data);
        const filteredOrders = response2.filter(
          (order) =>
            order.userId === loggedInUser.userData.userId && order.status === 0
        );

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
        console.log("totalPrice", totalPrice);
        console.log("filteredOrders", filteredOrders);
        setTotalPrice(totalPrice);
        setSizes(response1);
        console.log(response1);
        setCategories(response3);
        setShoe(response);
        setShoes(response4);
        setOrders(filteredOrders);
        setOrders(groupedOrders);
      } catch (error) {
        console.error("שגיאה בטעינת נתוני הנעל:", error);
      }
    };

    fetchShoeData();
  }, [params.shoesId, isOrdersUpdated]);

  const toggleCart = () => {
    setShowCart(!showCart); // Toggle cart visibility
  };

  const filterProductsByCategory = (categoryId) => {
    let filteredProducts = shoes;
    if (categoryId) {
      const numericCategoryId = Number(categoryId);
      console.log("numericCategoryId", numericCategoryId);
      filteredProducts = filteredProducts.filter(
        (shoe) => Number(shoe.categoryId) === numericCategoryId
      );
      console.log("filteredProducts", filteredProducts);
    }

    if (priceRange.min !== 0 || priceRange.max !== 1000) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );
    }
    setFilteredShoes(filteredProducts);
    return filteredProducts;
  };

  useEffect(() => {
    const filtered = filterProductsByCategory(selectedCategory);
    setFilteredShoes(filtered);
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    const filtered = filterProductsByCategory(selectedCategory);
    console.log("filtered", filtered);
    setFilteredProducts(filtered);
  };

  const handleSliderChange = (event) => {
    const newPrice = event.target.value;
    setPriceRange((prevPriceRange) => ({
      ...prevPriceRange,
      max: newPrice,
    }));

    const filteredProducts = filterProductsByCategory(selectedCategory);
    setFilteredShoes([...filteredProducts]);
  };

  const handleAddToCartSuccess = async () => {
    const response = await dataService.getAllShoes();
    setShoes(response);
  };

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null); // מצב חדש עבור הנעל שנבחרה

  const handleSuggestionClick = (shoeTitle) => {
    setText(shoeTitle); // מלא את תיבת הטקסט בהצעה שנבחרה
    setFilteredShoes([]); // סגור את רשימת ההצעות
    setShowSuggestions(false);
    setSelectedShoe(null); // איפוס הבחירה כשאין טקסט

    // כאן תוכל לבצע פעולה נוספת אם תרצה, כמו ניווט לדף המוצר
  };

  // const search = (currentText) => {
  //   setText(currentText); // עדכון הטקסט שהמשתמש הקליד
  //   // if (currentText.trim() === '') {
  //   //   setFilteredShoes([]); // אם הטקסט ריק, אל תציג הצעות
  //   //   setShowSuggestions(false);
  //   //   return;
  //   // }

  //   const findShoes = shoes.filter((s) =>
  //     s.title.toLowerCase().startsWith(currentText)
  //   );
  //   setFilteredShoes(findShoes);
  //   setShowSuggestions(findShoes.length > 0); // הצג הצעות רק אם יש תוצאות
  //   setSelectedShoe(null); // איפוס הבחירה בחיפוש חדש
  // };

  const search = (currentText) => {
    setText(currentText);
    if (currentText.trim() === '') {
      setFilteredShoes(shoes);
      setShowSuggestions(false);
      return;
    }

    const findShoes = shoes.filter((s) =>
      s.title.toLowerCase().startsWith(currentText.toLowerCase())
    );
    setFilteredShoes(findShoes);
    setShowSuggestions(findShoes.length > 0);
  };

  const handleClearClick = () => {
    setText("");
    setFilteredShoes(shoes);
    setShowSuggestions(false);
    setSelectedShoe(null); // איפוס הבחירה בלחיצה על Clear
  };

  async function deleteOrder(shoe, orderId) {
    try {
      const response2 = await dataService.getAllOrders2();
      const filteredOrders = response2.filter(
        (order) =>
          order.userId === loggedInUser.userData.userId && order.status === 0
      );
      let localShoppingBasket =
        shoe && shoe.shoppingBasket ? shoe.shoppingBasket : 0;
      console.log("localShoppingBasket", localShoppingBasket);

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

        if (Basket > 0 && updateStock === 1 && shoe) {
          shoe.stock++;
          shoe.bought--;
        }

        if (updateStock === 1) {
          await dataService.deleteOrder(orderToDelete.orderId);
        } else {
          await dataService.deleteOrder1(orderToDelete.orderId);
        }

        const updatedCartItems = [...cartItems];
        console.log("updatedCartItems", updatedCartItems);
        localShoppingBasket--;

        const total = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotalPrice1(total);

        if (localShoppingBasket > 0) {
          localShoppingBasket--;
        }

        if (shoe && shoe.shoesId) {
          // <-- הוספתי shoe.id לתנאי
          setShoe((prevShoe) => ({
            ...prevShoe,
            stock: prevShoe.stock + (Basket > 0 && updateStock === 1 ? 1 : 0),
            bought: prevShoe.bought - (Basket > 0 && updateStock === 1 ? 1 : 0),
            shoppingBasket:
              cartItems.find((item) => item.shoesId === shoe.shoesId)
                ?.quantity || 0, // <-- עדכון shoppingBasket לפי ה ID
          }));
        }

        setShoppingBasketCount(shoppingBasketCount + 1);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        const updatedOrders = orders.filter(
          (order) => order.orderId !== orderId
        );
        console.log("updatedOrders", updatedOrders);
        const newTotalPrice = updatedOrders.reduce(
          (sum, order) => sum + order.price,
          0
        );
        setTotalPrice(newTotalPrice);
        setTitleName(titleName);
        setShoppingBasketCount(shoppingBasketCount - 1);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        setIsOrdersUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const handleAddToCart = async (shoe, isFromCart = false) => {
    const userId = loggedInUser.userData.userId;
    console.log("userId", userId);
    const updateStock = loggedInUser.userData.updateStock;

    if (updateStock > 0) {
      console.log("shoes", shoe.stock--);
      console.log("shoes", shoe.bought++);
    }
    console.log("userId", userId);
    console.log("updateStock", updateStock);
    const shoesId = shoe.shoesId;
    const sizeId = shoe.sizeId;
    console.log("sizeId", sizeId);
    console.log("shoesId", shoesId);
    const quantity = 1;
    let localShoppingBasket = shoe.shoppingBasket ? shoe.shoppingBasket : 0;

    try {
      let sizeIdToUse = sizeId;
      const response2 = await dataService.getAllOrders2();
      const filteredOrders = response2.filter(
        (order) =>
          order.userId === loggedInUser.userData.userId && order.status === 0
      );

      console.log("selectedSizes1:", selectedSizes1); // בדיקת selectedSizes1
      console.log("filteredOrders:", filteredOrders); // בדיקת filteredOrders

      if (isFromCart) {
        setSelectedSizes1((prevSizes) => ({
          ...prevSizes,
          [shoe.shoesId]: shoe.sizeId,
        }));
      }

      const existingItemIndex = filteredOrders.findIndex((item) => {
        console.log("typeof item.shoesId:", typeof item.shoesId); // בדיקת סוג
        console.log("typeof shoe.shoesId:", typeof shoe.shoesId); // בדיקת סוג
        console.log("typeof item.sizeId:", typeof item.sizeId); // בדיקת סוג
        console.log(
          "typeof selectedSizes1+[shoe.shoesId]:",
          typeof selectedSizes[shoe.shoesId] === item.sizeId
        );
        return (
          item.shoesId === shoe.shoesId &&
          item.sizeId === (selectedSizes[shoe.shoesId] || sizeId)
        );
      });

      const selectedSizeStock =
        stockData1.find(
          (item) => item.sizeId === sizeIdToUse && item.shoesId === shoesId
        )?.stock || 0;

      console.log("selectedSizeStock", selectedSizeStock);
      if (selectedSizeStock === 0) {
        alert("אין מספיק מלאי עבור מידה זו.");
        return;
      }

      console.log("existingItemIndex", existingItemIndex);
      console.log("isFromCart:", isFromCart); // בדיקה 1

      if (existingItemIndex === -1) {
        sizeIdToUse = selectedSizes[shoe.shoesId];

        if (!sizeIdToUse) {
          console.error("Cannot add order without selected size.");
          return;
        }
      } else {
        sizeIdToUse = filteredOrders[existingItemIndex].sizeId;
        console.log("מידה מהסל:", sizeIdToUse);
      }

      if (updateStock === 1) {
        const response = await dataService.handleOrder(
          userId,
          shoesId,
          quantity,
          sizeIdToUse
        );
        console.log("response", response);
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
      const updatedCartItems = [...filteredOrders];
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
    } catch (error) {
      console.error("שגיאה:", error);
    }

    setIsOrdersUpdated((prev) => !prev);
  };

  const [selectedSizes, setSelectedSizes] = useState({}); // אובייקט לשמירת מידות לכל נעל

  return (
    <div>
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>
      </div>
      <div class="container">
        <select
          className="bbb"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>

        <div className="search-container">
          <input
            className="qqq"
            type="text"
            value={text}
            onChange={(e) => search(e.target.value)}
            placeholder=" Search shoes..."
            onFocus={() =>
              setShowSuggestions(filteredShoes.length > 0 && text.trim() !== "")
            }
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
          {showSuggestions && (
            <div className="suggestions-box">
              {filteredShoes.map((shoe) => (
                <Link
                  to={`/shoesUsers/${shoe.shoesId}`}
                >
                  <div className="suggestion-item">
                    {shoe.title}
                  </div>
                </Link>
              ))}
              {filteredShoes.length === 0 && text.trim() !== "" && (
                <div className="suggestion-item no-results">
                  לא נמצאו תוצאות
                </div>
              )}
            </div>
          )}
          <button className="ddd" onClick={handleClearClick}>
            Clear
          </button>        
        </div>
      </div>

      <div className="sliderValue">
        <span
          style={{
            position: "absolute",
            left: "10%",
            transform: "translateX(-50%)",
          }}
        >
          {priceRange.max}
        </span>
      </div>

      <br />
      <div className="range" style={{ marginLeft: "80px" }}>
        {" "}
        <div className="filed">
          <div className="value-left">0 ₪</div>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange.max}
            steps="1"
            onChange={handleSliderChange}
          />
          <div className="value-right">1000 ₪</div>
        </div>
      </div>
      <br />

      <ProductUserCard
        categories={categories}
        filterProducts={filterProductsByCategory}
        shoes={shoes}
        users={users}
        orders={orders}
        lastOrder={lastOrder}
        selectedCategory={selectedCategory}
        filteredShoes={filteredShoes}
        handleAddToCartSuccess={handleAddToCartSuccess}
      />

      {showCart && (
        <div className={`cartTab1 ${showCart ? 'active' : ''}`}>
        <h1>Shopping Cart</h1>
          {orders.length > 0 ? (
            <div className="listCart">
              {orders.map((cartItem, index) => (
                <div
                  key={`${cartItem.sizeId}-${cartItem.sizeId}-${index}`}
                  className="cartItem2"
                >
                  <br />
                  <div className="details">
                    <div className="name">Name: {cartItem.title}</div>
                    <div className="quantity">
                      Quantity: {cartItem.quantity}
                    </div>{" "}
                    <div className="size">Size: {cartItem.sizeId}</div>
                    <div className="price">Price: {cartItem.price}</div>
                  </div>
                  <Link to={`/shoesUsers/${cartItem.shoesId}`}>
                    {" "}
                    <img
                      src={appConfig.shoesImagesUsersUrl + cartItem.imageName}
                    />
                  </Link>
                  <button
                    className="addCart"
                    onClick={() => handleAddToCart(cartItem, selectedSizes)}
                  >
                    {" "}
                    ➕{" "}
                  </button>
                  <button onClick={() => deleteOrder(shoe, cartItem.orderId)}>
                    ➖
                  </button>
                </div>
              ))}
              <br />
              <p className="totalPrice">
                Total Shoes :{" "}
                {orders.reduce((sum, order) => sum + order.quantity, 0)}
                <br />
                Total Price : {totalPrice} ₪
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
    </div>
  );
}