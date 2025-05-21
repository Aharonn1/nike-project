import appConfig from "../Utils/AppConfig";
import axios from "axios";

const dataService = {
  async getAllShoes() {
    try {
      const response = await axios.get(appConfig.shoesUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getAllSizes() {
    try {
      const response = await axios.get(appConfig.sizeUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getAllShoesSizes(shoesId) {
    try {
      const response = await axios.get(`${appConfig.shoeSizeUrl + shoesId}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return [];
    }
  },

  async getAllShoesSizes1() {
    try {
      const response = await axios.get(`${appConfig.shoesUsersUrl2}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return [];
    }
  },
  async getAllFavorites() {
    try {
      const response = await axios.get(appConfig.favoriteUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getFavoritesByShoeId(shoeId) {
    try {
      const response = await axios.get(`${appConfig.favoriteUrl + shoeId}`);
      console.log("getFavoritesByShoeId", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching favorites:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getShoeById(shoes) {
    try {
      console.log("product");
      const response = await axios.get(`${appConfig.shoesUsersUrl + shoes}`);
      console.log("response.data", response.data); // הוספנו הדפסה של כל ה- response

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        const errorMessage = `Failed to fetch shoe: ${response.status} - ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching shoe:", error);
      return null;
    }
  },

  async deleteOrder(orderId) {
    const allOrders = await this.getAllOrders();
    await axios.delete(`${appConfig.shoesUsersUrl}${orderId}`);
  },

  async getAllOrdersAndShoesForAdmin() {
    try {
      const response = await axios.get(appConfig.graphsUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getAllUsers() {
    try {
      const response = await axios.get(appConfig.usersUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getAllImages() {
    try {
      const response = await axios.get(appConfig.imagesUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getAllOrders() {
    try {
      const response = await axios.get(appConfig.ordersUrl);
      // console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      return []; // Handle errors gracefully, consider returning an empty array
    }
  },

  async getAllOrders2(userId) {
    try {
      const response = await fetch(`${appConfig.ordersUserUrl}${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const orders = await response.json();
      console.log("getAllOrdersAndShoesOfUser", orders);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; 
    }
  },

  async updateOrdersStatus(orderIds, userId) {
    try {
      console.log("userId:", userId); // or
      console.log("orderIds:", orderIds); // בדיקה

      if (!userId) {
        throw new Error("User ID is undefined.");
      }

      const ordersToUpdate = orderIds.map((orderId) => ({ orderId }));

      const response = await fetch(`${appConfig.ordersUserUrl}${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ordersToUpdate),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  async getLastOrder() {
    const allOrders = await this.getAllOrders2();
    let lastOrder = allOrders.slice(-1)[0]; // לוקח את האלמנט האחרון במערך החדש
    await this.getAllOrders2();
    lastOrder = allOrders.slice(-1)[0]; // לוקח את האלמנט האחרון במערך החדש
    console.log("last order ", lastOrder.orderId);
    return lastOrder;
  },

  async deleteOrder1(orderId) {
    const allOrders = await this.getAllOrders2();
    await axios.delete(`${appConfig.shoesUsersUrl1}${orderId}`);
  },

  async deleteCategory(categoryId) {
    await axios.delete(`${appConfig.categoryshoesUrl}${categoryId}`);
  },

  async getAllOrdersByUser(userId) {
    console.log(userId);
    try {
      if (!userId) return []; // החזר מערך ריק אם userId חסר
      const response = await axios.get(`${appConfig.ordersUserUrl}/${userId}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching user orders:", err);
      return [];
    }
  },

  async getAllClothing() {
    try {
      const response = await axios.get(appConfig.clothingUrl);
      return response.data;
    } catch (err) {
      console.error("Error fetching clothing:", err);
      return []; // Handle errors gracefully
    }
  },

  async getAllCategories() {
    try {
      const response = await axios.get(appConfig.categoryshoesUrl);
      console.log("getAllCategories", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching clothing:", err);
      return []; // Handle errors gracefully
    }
  },

  async updateCategory(updatedCategory) {
    const headers = { "Content-Type": "application/json" }; // Assuming JSON data
    console.log("updatedCategory", updatedCategory);
    const url = appConfig.categoryshoesUrl + `${updatedCategory.categoryId}`;
    console.log("url " + url);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedCategory), // Stringify updated category data
      });

      if (response.ok) {
        const updatedCategoryData = await response.json();
        console.log(updatedCategoryData);
        console.log("Category updated successfully:", updatedCategoryData);

        return updatedCategoryData; // Return updated data for potential UI updates
      } else {
        throw new Error(`Error updating category: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      // Handle errors gracefully, e.g., display an error message to the user
      return null; // Indicate failure (optional)
    }
  },

  async updateProduct(updatedProduct) {
    const headers = { "Content-Type": "application/json" }; // Assuming JSON data

    const url = appConfig.shoesUrl + `${updatedProduct.shoesId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedProduct), // Stringify updated category data
      });

      if (response.ok) {
        const updatedCategoryData = await response.json();
        console.log(updatedCategoryData);
        console.log("Category updated successfully:", updatedCategoryData);
        console.log(updatedCategoryData);
        return updatedCategoryData; // Return updated data for potential UI updates
      } else {
        throw new Error(`Error updating category: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      // Handle errors gracefully, e.g., display an error message to the user
      return null; // Indicate failure (optional)
    }
  },

  async updateOrder(updatedOrder) {
    const headers = { "Content-Type": "application/json" };

    const url = appConfig.ordersUrl + `${updatedOrder.orderId}`; // הנחתי שיש לך appConfig עם ordersUrl

    try {
      const response = await fetch(url, {
        method: "PUT", // או PATCH אם אתה מעדכן חלק מהנתונים
        headers: headers,
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        const updatedOrderData = await response.json();
        console.log("Order updated successfully:", updatedOrderData);
        return updatedOrderData;
      } else {
        const errorData = await response.json(); // נסה לקבל מידע על השגיאה מהשרת
        throw new Error(
          `Error updating order: ${response.status} - ${
            errorData?.message || response.statusText
          }`
        ); // include error message from the server if available
      }
    } catch (error) {
      console.error("Error updating order:", error);
      // טיפול בשגיאות בצורה יותר טובה, למשל, הצגת הודעה למשתמש
      return null; // או throw error אם אתה רוצה שהקומפוננטה שתקרא לפונקציה תטפל בשגיאה
    }
  },

  async createShoes(newUserObject) {
    const response = await axios.post(
      appConfig.shoesUrl,
      newUserObject,
      console.log(newUserObject)
    );
    return response.data; // Newly created user object
  },

  async handleOrder(userId, shoesId, quantity, sizeId) {
    try {
      const response = await axios.post(appConfig.shoesUsersUrl + `${userId}`, {
        userId,
        shoesId,
        quantity,
        // orderDate: formattedDate,
        sizeId,
      });
      console.log("response.data", response.data);
      console.log("הזמנה הוגשה בהצלחה");
    } catch (error) {
      console.error("Error adding order:", error.message);
      if (error.response) {
        alert(`שגיאה מהשרת: ${error.response.data}`);
      } else {
        alert("שגיאה בהוספת הזמנה");
      }
    } finally {
      await this.getAllShoes();
    }
  },

  async handleOrder1(userId, shoesId, quantity, orderDate) {
    try {
      const orderDate = new Date();
      const formattedDate = orderDate.toISOString();
      const response = await axios.post(
        appConfig.shoesUsersUrl1 + `${userId}`,
        {
          userId,
          shoesId,
          quantity,
          orderDate: formattedDate,
        }
      );
      console.log(response);
      console.log("הזמנה הוגשה בהצלחה");

      await this.getAllShoes();
    } catch (error) {
      console.error("Error adding order:", error.message);
    }
  },

  async addComment(comment) {
    try {
      const response = await axios.post(`${appConfig.commentsUrl}`, comment, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("response.data", response.data);
      console.log("תגובה נוספה בהצלחה");
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error.message);
      if (error.response) {
        alert(`שגיאה מהשרת: ${error.response.data}`);
      } else {
        alert("שגיאה בהוספת תגובה");
      }
      throw error;
    }
  },

  async getAllComments(shoesId) {
    try {
      const response = await axios.get(`${appConfig.commentsUrl}${shoesId}`);
      console.log("response.data", response.data);
      console.log("תגובות נטענו בהצלחה");
      return response.data;
    } catch (error) {
      console.error("Error getting comments:", error.message);
      if (error.response) {
        alert(`שגיאה מהשרת: ${error.response.data}`);
      } else {
        alert("שגיאה בטעינת תגובות");
      }
      throw error; 
    }
  },

  async updateUser(updateUser) {
    const headers = { "Content-Type": "application/json" }; // Assuming JSON data
    const url = appConfig.myAccount + `${updateUser.userId}`;
    console.log(updateUser);

    console.log("url ", url);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updateUser), // Stringify updated category data
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        console.log(updatedUserData);
        console.log("Category updated successfully:", updatedUserData);
        console.log(updatedUserData);
        return updatedUserData; // Return updated data for potential UI updates
      } else {
        throw new Error(`Error updating category: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      return null;
    }
  },

  async getAllFavoritesByUser(userId) {
    try {
      const response = await axios.get(
        `${appConfig.favoriteUserUrl}${userId.userId}`
      );
      console.log(response.data);
      const favorites = response.data;
      return favorites;
    } catch (error) {
      console.error("שגיאה:", error);
      throw error;
    }
  },

  async createCategory(newUserObject) {
    const response = await axios.post(
      appConfig.categoryshoesUrl,
      newUserObject,
      console.log(newUserObject)
    );
    return response.data; // Newly created user object
  },

  async createClothing(newUserObject) {
    const response = await axios.post(appConfig.clothingUrl, newUserObject);
    return response.data; // Newly created user object
  },

  async addFavorite(userId, shoesId) {
    try {
      const response = await axios.post(
        `${appConfig.shoesUsersFavoriteUrl}${shoesId}`,
        { userId }
      );
      if (response.status === 200) {
        console.log("הלייק נוסף בהצלחה");
      } else {
        console.error("שגיאה בהוספת לייק");
        if (response.data.message) {
          alert(response.data.message); 
        }
      }
    } catch (error) {
      console.error("שגיאה:", error);
    }
  },

  async removeFavorite(userId, shoesId) {
    try {
      const response = await axios.delete(
        `${appConfig.shoesUsersFavoriteUrl}${shoesId}`,
        { data: { userId: userId.userId } }
      );
      if (response.status === 204) {
        console.log("הלייק הוסר בהצלחה");
      } else {
        console.error("שגיאה בהסרת לייק");
      }
    } catch (error) {
      console.error("שגיאה:", error);
    }
  },
};

export default dataService;