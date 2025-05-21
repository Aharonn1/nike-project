import React, { useState, useEffect } from "react";
import ProductUserCard from "./ProductUserCard";
import OneProductsCard from "./OneProductsCard";
import dataService from "../Service/DataService";

function Shop() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice1, setTotalPrice1] = useState(0);
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const fetchedShoes = await dataService.getAllShoes();
        setShoes(fetchedShoes);
        setFilteredShoes(fetchedShoes);
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    };

    fetchShoes();
  }, []);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const fetchedSizes = await dataService.getAllSizes();
        setSizes(fetchedSizes);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    };

    fetchSizes();
  }, []);

  const handleAddToCart = (shoe, selectedSize) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.shoesId === shoe.shoesId && item.size === selectedSize?.sizeId
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([
        ...cartItems,
        {
            shoesId: shoe.shoesId,
            title: shoe.title,
            quantity: 1,
            price: shoe.price,
            size: selectedSize?.sizeId,
            shoppingBasket: 1, 
        },
      ]);
    }

    // Update total price
    setTotalPrice1(totalPrice1 + shoe.price); 
  };

  const deleteOrder = async (shoeId) => {
    try {
      let localShoppingBasket = shoeId.shoppingBasket
        ? shoeId.shoppingBasket
        : 0;
      const shoesId = shoeId.shoesId;
      let orders1 = await dataService.getAllOrders2();
      const filteredOrders = orders1.filter(
        (order) => order.shoesId === shoesId
      );
      let lastOrder = filteredOrders.slice(-1)[0];
      const orderToDelete = filteredOrders.find((order) => {
        return order.orderId === lastOrder.orderId;
      });

      if (
        filteredOrders &&
        localShoppingBasket > 0
      ) {
        const updateStock = loggedInUser.userData.updateStock;

        if (updateStock === 1) {
          await dataService.deleteOrder(orderToDelete.orderId);
        } else {
          await dataService.deleteOrder1(orderToDelete.orderId);
        }
        localShoppingBasket--;

        const updatedCartItems = [...cartItems];
        if (updatedCartItems) {
          const existingItemIndex = updatedCartItems.findIndex(
            (item) => item.shoesId === shoeId.shoesId
          );
          if (existingItemIndex !== -1) {
            updatedCartItems[existingItemIndex].shoppingBasket--;
            setTotalPrice1(totalPrice1 - shoeId.price); 
          } else {
            updatedCartItems.push({ ...shoeId, shoppingBasket: 1 });
          }
        }
      }
      shoeId.shoppingBasket = localShoppingBasket;
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      <ProductUserCard
        handleAddToCart={handleAddToCart}
        deleteOrder={deleteOrder}
        filteredShoes={filteredShoes}
        cartItems={cartItems}
        totalPrice1={totalPrice1}
      />
      <OneProductsCard
        handleAddToCart={handleAddToCart}
        deleteOrder={deleteOrder}
        shoes={shoes}
        sizes={sizes}
        cartItems={cartItems}
        totalPrice1={totalPrice1}
      />
    </div>
  );
}

export default Shop;