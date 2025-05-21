import React, { useState, useEffect } from "react";
import dataService from "../Service/DataService";

function CategoriesCard(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState(props.category.categoryName);

  const handleInputChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCategoryName(props.category.categoryName); // Reset category name to original value on cancel
  };

  async function deleteCategory() {
    try {
      const sure = window.confirm("Are you sure you want to delete this category?");
      if (!sure) return;

      await dataService.deleteCategory(props.category.categoryId);
      props.onCategoryDeleted(); // Call parent function to trigger re-render (optional)
      alert("Category deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  }

  async function updateCategory() {
    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }

    try {
      const updatedCategory = { categoryId: props.category.categoryId, categoryName };
      await dataService.updateCategory(updatedCategory);
      setIsEditing(false); // Update state for immediate UI change
      // props.onCategoryUpdated && props.onCategoryUpdated(updatedCategory); // Call parent function if available

      alert("Category updated successfully.");
    } catch (err) {
      alert(err.message);
    }
  }

  // useEffect(() => {
  //   if (props.categoryDeleted) { // Check for prop from parent (optional)
  //     // Handle category deletion in CategoriesCard (optional)
  //     console.log("Category deleted:", props.categoryDeleted);
  //   }
  // }, [props.categoryDeleted]);

  return (
    <div className="category">
      {isEditing ? (
        <>
          Name:
          <input
            type="text"
            name="name"
            value={categoryName}
            onChange={handleInputChange}
          />
          <br />
          <button onClick={updateCategory}>Update</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          Category Name: {categoryName} <br />
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
      <button onClick={deleteCategory} style={{ backgroundColor: "red" }}>
        Delete
      </button>
    </div>
  );
}

export default CategoriesCard;