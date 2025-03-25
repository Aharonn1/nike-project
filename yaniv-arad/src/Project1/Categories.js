import { useState, useEffect } from "react";
import dataService from "../Service/DataService";
import CategoriesCard from "./CategoriesCard";
import { NavLink } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dataService.getAllCategories();
      setCategories(response);
    };
    fetchData();
  }, []);

  const handleUserDeleted = async (deletedCategoryId) => {
    try {
      await dataService.deleteCategory(deletedCategoryId); // Call service to delete from database (if applicable)
      setCategories(
        categories.filter(
          (category) => category.categoryId !== deletedCategoryId.categoryId
        )
      );
    } catch (err) {
      console.error("Error deleting category:", err);
      // Handle deletion errors (optional)
    }
  };

  return (
    <div>
      {categories.map((category) => (
        <CategoriesCard
          key={category.categoryId}
          category={category}
          onUserDeleted={handleUserDeleted}
        />
      ))}
      <div className="center-link">
        <NavLink to="/categoryshoes/new">➕</NavLink>
      </div>
    </div>
  );
}
