import dataService from "../Service/DataService";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ProductsCard from "./ProductsCard";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [shoes, setShoes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dataService.getAllShoes();
      const response1 = await dataService.getAllCategories();
      const response2 = await dataService.getAllOrders();
      const response3 = await dataService.getAllUsers();
      setOrders(response2);
      console.log("all orders", response2);
      setCategories(response1);
      setUsers(response3);
      setShoes(response);
    };
    fetchData();
  }, []);

  const filterProductsByCategory = (categoryId) => {
    if (!categoryId) return shoes; // Return all shoes if no category selected
    // Ensure categoryId is a number for comparison
    const numericCategoryId = Number(categoryId);
    return shoes.filter(
      (shoe) => Number(shoe.categoryId) === numericCategoryId
    );
  };

  // Define a state variable for the selected category (initially empty)

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Function to update a product (assuming dataService.updateProduct handles updates)
  const updateProduct = async (updatedProduct) => {
    try {
      const response = await dataService.updateProduct(updatedProduct);
      // Update local shoes state to reflect the updated product
      setShoes(
        shoes.map((shoe) =>
          shoe.shoesId === updatedProduct.shoesId ? response : shoe
        )
      );
      alert("Product updated successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const calculateTotalStock = () => {
    const filteredShoes = filterProductsByCategory(selectedCategory); // סינון נעליים לפי קטגוריה
    return filteredShoes.length;
  };

  return (
    <div>
      <div className="center-select">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <p className="total-stock">
        Total Shoes in Stock for{" "}
          {selectedCategory
            ? categories.find(
                (category) => category.categoryId === selectedCategory
              )?.categoryName
            : "All Categories"}
          : {calculateTotalStock()}
        </p>
      </div>
      <br />
      <ProductsCard
        shoes={shoes}
        categories={categories}
        filterProducts={filterProductsByCategory}
        orders={orders}
        users={users}
        selectedCategory={selectedCategory}
        onProductUpdated={updateProduct} // Pass updateProduct function as a prop
      />
      <div className="center-button">
        <NavLink to="/shoes/new">➕</NavLink>
      </div>{" "}
    </div>
  );
}