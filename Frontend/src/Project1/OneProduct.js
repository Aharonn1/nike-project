// import { useState, useEffect } from "react";
// import dataService from "../Service/DataService";
// import ProductUserCard from "./ProductsUsersCard";

// export default function OneProduct() {
//   const [shoes, setShoes] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [lastOrder, setLastOrder] = useState(null); // State for last order (optional)
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [text, setText] = useState("");
//   const [filteredShoes, setFilteredShoes] = useState(shoes); // Initial filteredShoes matches all shoes
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   // const loggedInUser = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const fetchData = async () => {
//       const response1 = await dataService.getAllCategories();
//       const response2 = await dataService.getAllUsers();
//       const response5 = await dataService.getLastOrder();
//       const response = await dataService.getAllShoes();
//       const response7 = await dataService.getAllOrders2();
//       // const filteredOrders = response7.filter(
//       //   (order) => order.userId === loggedInUser.userId
//       // );
//       setLastOrder(response5);
//       setUsers(response2);
//       setCategories(response1);
//       setShoes(response);
//       // setOrders(filteredOrders);
//     };
//     fetchData();
//   }, []);

  
//   const filterProductsByCategory = (categoryId) => {
//     let filteredProducts = shoes;
//     // console.log("filteredProducts" , filteredProducts)
//     if (categoryId) {
//       const numericCategoryId = Number(categoryId);
//       console.log("numericCategoryId" , numericCategoryId)
//       filteredProducts = filteredProducts.filter(
//         (shoe) => Number(shoe.categoryId) === numericCategoryId
//       );
//       console.log("filteredProducts" , filteredProducts)
//     }
    
//     if (priceRange.min !== 0 || priceRange.max !== 1000) {
//       filteredProducts = filteredProducts.filter(
//         (product) =>
//           product.price >= priceRange.min && product.price <= priceRange.max
//       );
//     }
    
//     setFilteredShoes(filteredProducts)
//     return filteredProducts;
//   };
    
//   useEffect(() => {
//     const filtered = filterProductsByCategory(selectedCategory);
//     setFilteredShoes(filtered); // עדכן שוב בתוך useEffect
//   }, [selectedCategory]); // רינדור מחדש רק בעת שינוי ב-selectedCategory
  


//   const handleCategoryChange = (event) => {
//     setSelectedCategory(event.target.value);
//     const filtered = filterProductsByCategory(selectedCategory);
//     console.log("filtered" , filtered)
//     setFilteredProducts(filtered);
//   };
  
//   const handleSliderChange = (event) => {
//     const newPrice = event.target.value;
//     setPriceRange(prevPriceRange => ({
//       ...prevPriceRange,
//       max: newPrice
//     }));
  
//     // סינון מוצרים לפי קטגוריה לאחר שינוי המחיר
//     const filteredProducts = filterProductsByCategory(selectedCategory);
  
//     // עדכון state עם עותק חדש של filteredShoes
//     setFilteredShoes([...filteredProducts]);
//   };

//   const handleAddToCartSuccess = async () => {
//     const response = await dataService.getAllShoes();
//     setShoes(response);
//   };

//   const search = () => {
//     const findShoes =
//       shoes && shoes?.length > 0
//         ? shoes?.filter((s) =>
//             s?.title.toLowerCase().includes(text.toLowerCase())
//           ) // Case-insensitive search
//         : undefined;
//     setShoes(findShoes);
//     setFilteredShoes(findShoes);
//   };

//   return (
//     <div>
//       <div class="container">
//       <select className="bbb" value={selectedCategory} onChange={handleCategoryChange}>
//         <option value="">בחר קטגוריה</option>
//         {categories.map((category) => (
//           <option key={category.categoryId} value={category.categoryId}>
//             {category.categoryName}
//           </option>
//         ))}
//       </select>
      
//       <input className="qqq"
//         type="text"
//         placeholder="search shoes"
//         value={text}
//         onChange={(e) => {
//           setText(e.target.value);
//         }}
//       />

//       <button className="ddd" onClick={search}>search</button>
//       <button className="ccc" onClick={handleAddToCartSuccess}>shoes</button>
//       <button className="ddd"
//         onClick={() => {
//           setText("");
//           setFilteredShoes(shoes);
//         }}
//       >
//         Clear 
//       </button>
//       </div>

//       <div className="sliderValue">
//         <span style={{ position: 'absolute', left: '10%', transform: 'translateX(-50%)' }}>{priceRange.max}</span>
//       </div>

//       <br/>
//       <div className="range">
//       <div className="filed">
//         <div className="value-left">0</div>
//         <input
//           type="range"
//           min="0"
//           max="1000"
//           value={priceRange.max}
//           steps="1"
//           onChange={handleSliderChange}
//         />
//         <div className="value-right">1000</div>
//       </div>
//     </div>

//       <ProductUserCard
//          categories={categories}
//          filterProducts={filterProductsByCategory}
//          shoes={shoes}
//          users={users}
//          orders={orders}
//          lastOrder={lastOrder}
//          selectedCategory={selectedCategory}
//          filteredShoes={filteredShoes} // העבר את filteredShoes המעודכן
//          handleAddToCartSuccess={handleAddToCartSuccess} // (אופציונלי)
//       />
//     </div>
//   );
// }
