import React, { useState, useEffect } from "react";
import dataService from "../Service/DataService";
import { useNavigate } from "react-router-dom";
import appConfig from "../Utils/AppConfig";
import { useForm } from "react-hook-form";

function AddShoe() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataService.getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  async function addShoe(newShoe) {
    const formData = new FormData();
    formData.append('shoeData', JSON.stringify({
      categoryId: newShoe.categoryId,
      description: newShoe.description,
      price: newShoe.price,
      title: newShoe.title,
      bought: newShoe.bought,
      stock:newShoe.stock,
      imageLink:newShoe.imageLink,
    }));
    formData.append('image', newShoe.image);
    console.log(newShoe)
    try {
        const response = await fetch(appConfig.shoesUrl, {
            method: 'POST',
            body: formData
        });
        navigate("/shoes")
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Shoe added successfully:', data);
    } catch (error) {
        console.error('Error adding shoe:', error);
    }
}

  return (
    <div className="AddShoeBox">
      <h1>Add Shoe</h1>
      <form onSubmit={handleSubmit(addShoe)}>
        <label>Category:</label>
        <select {...register("categoryId")}>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          {categories.length === 0 && <option>Loading categories...</option>}
        </select>
        <br />
        <label>Description:</label>
        <input type="text" {...register("description")} />
        <br />

        <label>Price:</label>
        <input type="number" {...register("price")} />
        <br />

        <label>Title:</label>
        <input type="text" {...register("title")} />
        <br />

        <label>Bought:</label>
        <input type="number" {...register("bought")} />
        <br />

        <label>Stock:</label>
        <input type="number" {...register("stock")} />

        <label>Image Link:</label>
        <input type="text" {...register("imageLink")} />
        <br />

        <label>Image:</label>
        <input type="file" {...register("image")}/>
        <br />

        <button>Add Shoe</button>
      </form>
    </div>
  );
}

export default AddShoe;