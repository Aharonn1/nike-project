import dataService from "../Service/DataService";
import { useState, useEffect } from "react";
import UsersCard from "./UsersCard";

export default function Products() {
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
      console.log("response3" , response3)
      setOrders(response2);
      setCategories(response1);
      setShoes(response);
      setUsers(response3);
    };
    fetchData();
  }, []);

  const filterProductsByCategory = (categoryId) => {
    if (!categoryId) return shoes; // Return all shoes if no category selected
    // Ensure categoryId is a number for comparison
    const numericCategoryId = Number(categoryId);
    return shoes.filter((shoe) => Number(shoe.categoryId) === categoryId.categoryId);
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div>
      <br/>
      <UsersCard
        categories={categories}
        filterProducts={filterProductsByCategory}
        shoes={shoes}
        orders={orders}
        users={users}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}