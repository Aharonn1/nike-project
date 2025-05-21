import React, { useState } from "react";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";

function ProductsCard(props) {
  const filteredShoes = props.filterProducts(props.selectedCategory);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductValues, setEditedProductValues] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProductValues({ ...editedProductValues, [name]: value });
  };

  const allOrders = props.orders.map((order) => order);

  async function updateProduct() {
    try {
      const updatedProduct = {
        shoesId: editingProductId,
        ...editedProductValues,
      };
      await dataService.updateProduct(updatedProduct);
      setEditingProductId(null);
      setEditedProductValues({});

      if (props.onProductUpdated) {
        props.onProductUpdated(updatedProduct);
      }

      alert("Product updated successfully.");
    } catch (err) {
      alert(err.message);
    }
  }

  const handleEditClick = (shoeId) => {
    setEditingProductId(shoeId);
    setEditedProductValues({
      title: props.shoes.find((shoe) => shoe.shoesId === shoeId).title,
      description: props.shoes.find((shoe) => shoe.shoesId === shoeId)
        .description,
      price: props.shoes.find((shoe) => shoe.shoesId === shoeId).price,
    });
  };

  return (
    <div>
      {filteredShoes.length > 0 ? (
        <div className="product-tabs">
          {filteredShoes.map((shoe) => (
            <div key={shoe.shoesId} className="product-tab">
              <h3>{shoe.title}</h3>
              <img src={appConfig.shoesImagesUsersUrl + shoe.imageName} />
              <p>Price: {shoe.price} ₪</p>
              <p>{shoe.description}</p>
              <h4>Users who ordered this shoe:</h4>
              <div className="orders-details">
                {allOrders.filter(
                  (order) =>
                    order.categoryId === shoe.categoryId &&
                    order.shoesId === shoe.shoesId
                ).length > 0 && (
                  <ul style={{ height: "750px", overflowY: "scroll" }}>
                    {allOrders
                      .filter(
                        (order) =>
                          order.categoryId === shoe.categoryId &&
                          order.shoesId === shoe.shoesId
                      )
                      .map((order) => (
                        <li key={order.orderId}>
                          <p>Name: {order.customer_name}</p>
                          <p>Quantity: {order.total_quantity}</p>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <button onClick={() => handleEditClick(shoe.shoesId)}>
                {editingProductId === shoe.shoesId ? "Cancel edit" : "Edit"}
              </button>

              {editingProductId === shoe.shoesId && (
                <div className="edit-form">
                  <input
                    type="text"
                    name="title"
                    defaultValue={editedProductValues.title || shoe.title}
                    onChange={handleInputChange}
                  />
                  <textarea
                    name="description"
                    defaultValue={
                      editedProductValues.description || shoe.description
                    }
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="price"
                    defaultValue={editedProductValues.price || shoe.price}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="imageLink"
                    defaultValue={
                      editedProductValues.imageLink || shoe.imageLink
                    }
                    onChange={handleInputChange}
                  />
                  <button onClick={updateProduct}>Update product</button>
                  <button onClick={() => setEditingProductId(null)}>
                   Cancel edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No found products</p>
      )}
    </div>
  );
}

export default ProductsCard;