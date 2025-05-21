import React, { useState, useEffect, useRef, useCallback } from "react";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import { NavLink } from "react-router-dom";

function ProductUserCard(props) {
  const [filteredShoes, setFilteredShoes] = useState(props.shoes);
  const [showCart, setShowCart] = useState(false);
  const closeCartRef = useRef(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockData1, setStockData1] = useState([]);
  const [shoesOutOfStock, setShoesOutOfStock] = useState({});
  const [outOfStockShoesDetails, setOutOfStockShoesDetails] = useState([]);
  
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const fetchShoes = useCallback(async () => {
    const shoes = await dataService.getAllShoes();
    console.log("props.cartItems", props.cartItems);
    setFilteredShoes(shoes);
  }, [dataService.getAllShoes]);

  useEffect(() => {
    (async () => {
      const stockData1 = await dataService.getAllShoesSizes1();
      console.log("stockData1", stockData1);
      setStockData1(stockData1);
      fetchShoes();

      if (stockData1) {
        const shoesOutOfStock = {};
        const outOfStockShoesDetails = [];

        for (const item of stockData1) {
          if (!shoesOutOfStock[item.shoesId]) {
            const allSizesOutOfStock = stockData1
              .filter((shoe) => shoe.shoesId === item.shoesId)
              .every((size) => size.stock === 0);

            if (allSizesOutOfStock) {
              shoesOutOfStock[item.shoesId] = true;
              const shoeDetails = filteredShoes.find(
                (shoe) => shoe.shoesId === item.shoesId
              );
              if (shoeDetails) {
                outOfStockShoesDetails.push(shoeDetails);
              }
            }
          }
        }
        console.log("shoesOutOfStock:", shoesOutOfStock);
        setShoesOutOfStock(shoesOutOfStock);
        console.log("outOfStockShoesDetails:", outOfStockShoesDetails);
        setOutOfStockShoesDetails(outOfStockShoesDetails);   
      }
    })();
  }, []);

  const filterProducts = (products, categoryId, priceRange) => {
    let filteredProducts = products;
    if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (shoe) => Number(shoe.categoryId) === Number(categoryId)
      );
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
    const filtered = filterProducts(
      props.filteredShoes,
      selectedCategory,
      priceRange
    );
    setFilteredShoes(filtered);
  }, [props.filteredShoes, selectedCategory, priceRange]);

  useEffect(() => {
    if (closeCartRef.current) {
      closeCartRef.current.addEventListener("click", toggleCart);
    }
    return () => {
      if (closeCartRef.current) {
        closeCartRef.current.removeEventListener("click", toggleCart);
      }
    };
  }, [closeCartRef]);

  return (
    <div className="listProduct">
      <div className="svg-container" onClick={toggleCart}></div>
      <div className="item">
        {filteredShoes.length > 0 && (
          <div className="product-grid">
            {filteredShoes.map((shoe) => (
              <div key={shoe.shoesId} className="product-box">
                <NavLink to={"/shoesUsers/" + shoe.shoesId}>
                  <img
                    className="product-image"
                    src={appConfig.shoesImagesUsersUrl + shoe.imageName}
                  />
                </NavLink>
                <div className="product-details">
                  <div className="name">Name: {shoe.title}</div>
                  <div className="total-price">Price: {shoe.price} ₪</div>
                </div>
                {shoesOutOfStock[shoe.shoesId] && (
                  <div className="out-of-stock">The product is out of stock</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductUserCard;