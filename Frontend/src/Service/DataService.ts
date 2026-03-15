import CategoryShoesModel from "../models/CategoryShoesModel";
import CommentModel from "../models/CommentModel";
import FavoriteModel from "../models/FavoriteModel";
import ImagesModel from "../models/ImagesModel";
import OrderModel from "../models/OrderModel";
import ShoesModel from "../models/ShoesModel";
import shoesSizeModel from "../models/shoesSizeModel";
import SizeModel from "../models/SizeModel";
import UserModel from "../models/UserModel";
import appConfig from "../Utils/AppConfig";
import axios, { AxiosError } from "axios";


interface ErrorModel {
  message: string;
  status: number;
}

export interface DetailedShoeModel {
  shoesId: number;
  title: string;
  price: number;
  description: string;
  stock: number;
  bought: number;
  imageName: string;
  userId: number;
  categoryName: string; // שדה שהוספת
  total_favorites: number; // שדה שהוספת
  imageNameAbove: string;
  imageNameSide?: string; // אם יש עוד תמונות, כדאי להוסיף אותן כאן
  imageNameFront?: string;
  imageNameBack?:string;
  imageNameDown?:string;
  video:string;
  shoppingBasket?:number;
}

function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorModel>;
    // כאן אתה יכול לפרש את השגיאה מהבקאנד ולטפל בה
    const errorMessage = axiosError.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage); // זורק שגיאה עם ההודעה מהשרת
  } else {
    throw new Error("An unexpected error occurred.");
  }
}

const dataService = {
  async getAllShoes(): Promise<ShoesModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<ShoesModel[]>(appConfig.shoesUrl);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        // הצהרת טיפוס (Type Assertion) בטוחה
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת לפני הגישה לנתונים
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching shoes:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות שאינן שגיאות רשת
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  async getAllSizes(): Promise<SizeModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<SizeModel[]>(appConfig.sizeUrl);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        // הצהרת טיפוס בטוחה
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching sizes:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  // קבלת כל המידות של נעל ספציפית
  async getAllShoesSizes(shoesId: number): Promise<shoesSizeModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<shoesSizeModel[]>(`${appConfig.shoeSizeUrl}${shoesId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching shoes sizes:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  // קבלת כל המידות והנעליים למשתמשים
  async getAllShoesSizes1(): Promise<any[]> {
    try {
      const response = await axios.get(`${appConfig.shoesUsersUrl2}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching shoes and sizes for users:", err);
      return [];
    }
  },

  // קבלת כל הפריטים המועדפים
  async getAllFavorites(): Promise<FavoriteModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<FavoriteModel[]>(appConfig.favoriteUrl);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching favorites:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },
  // קבלת פריטים מועדפים לפי מזהה נעל
  async getFavoritesByShoeId(shoeId: number): Promise<FavoriteModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<FavoriteModel[]>(`${appConfig.favoriteUrl}${shoeId}`);
      console.log("getFavoritesByShoeId", response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching favorites:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  // קבלת נעל לפי מזהה


  async getShoeById(shoesId: number): Promise<DetailedShoeModel | null> {
    try {
      console.log("product");
      // נניח שקריאת ה-API מחזירה את הנתונים המורחבים
      const response = await axios.get<DetailedShoeModel>(`${appConfig.shoesUsersUrl}${shoesId}`);
      console.log("response.data", response.data);

      // אם הנתונים מגיעים חלקיים, נשלים אותם כאן לפני ההחזרה
      // לדוגמה, אם השדה total_favorites לא תמיד קיים:
      const shoe = {
        ...response.data,
        total_favorites: response.data.total_favorites || 0,
      };

      return shoe;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // const axiosError = error as AxiosError<ErrorModel>;
        // const errorMessage = axiosError.response?.data?.message || `Error fetching shoe with ID ${shoesId}.`;
        // console.error("Error fetching shoe:", errorMessage);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      return null;
    }
  },

  // מחיקת הזמנה
  async deleteOrder(orderId: number): Promise<void> {
    try {
      // ביצוע קריאת ה-delete, ללא ציפייה לנתונים חזרה
      await axios.delete(`${appConfig.shoesUsersUrl}${orderId}`);
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // רישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || `Error deleting order with ID ${orderId}.`;
        console.error("Error deleting order:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      // הפונקציה מחזירה void, ולכן לא מחזירים דבר במקרה של שגיאה
      // היא מסתיימת בצורה מסודרת גם אם נזרקה שגיאה
    }
  },

  // קבלת כל ההזמנות והנעליים למנהל מערכת
  async getAllOrdersAndShoesForAdmin(): Promise<any[]> {
    try {
      const response = await axios.get(appConfig.graphsUrl);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching orders and shoes for admin:", err);
      return [];
    }
  },

  // קבלת כל המשתמשים
  async getAllUsers(): Promise<UserModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<UserModel[]>(appConfig.usersUrl);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching users:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  async updateUser(user: UserModel): Promise<UserModel | null> {
    try {
      // תיקון: הוספת סלאש (/) בין הכתובת ל-ID
      const response = await axios.put<UserModel>(`${appConfig.myAccount}${user.userId}`, user);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;
        const errorMessage = axiosError.response?.data?.message || `Error updating user with ID ${user.userId}.`;
        console.error("Error updating user:", errorMessage);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      return null;
    }
  },

  // קבלת כל התמונות
  async getAllImages(): Promise<ImagesModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<ImagesModel[]>(appConfig.imagesUrl);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching images:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  // קבלת כל ההזמנות
  async getAllOrders(): Promise<OrderModel[]> {
    try {
      // הוספת בטיחות טיפוסים לקריאת ה-API
      const response = await axios.get<OrderModel[]>(appConfig.ordersUrl);
      return response.data;
    } catch (error) {
      // טיפול נכון בשגיאות באמצעות Type Guard
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorModel>;

        // בדיקה שהתגובה קיימת ורישום הודעת שגיאה ספציפית
        const errorMessage = axiosError.response?.data?.message || "An unknown network error occurred";
        console.error("Error fetching orders:", errorMessage);
      } else {
        // טיפול בשגיאות אחרות
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  },

  // קבלת כל ההזמנות של משתמש ספציפי
  async getAllOrders2(userId: number): Promise<OrderModel[]> {
    try {
      console.log("userId", userId)
      const response = await fetch(`${appConfig.ordersUserUrl}${userId}`);
      console.log("getAllOrders2" , response);
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

 async getAllOrders3(userId: number): Promise<OrderModel[]> {
    try {
      console.log("userId", userId)
      const response = await fetch(`${appConfig.ordersUserUrl3}${userId}`);
      console.log("getAllOrders2" , response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const orders = await response.json();
      // console.log("getAllOrdersAndShoesOfUser", orders);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // עדכון סטטוס הזמנות
  async updateOrdersStatus(orderIds: number[], userId: number): Promise<void> {
    try {
      if (!userId) {
        throw new Error("User ID is undefined.");
      }
      const ordersToUpdate = orderIds.map((orderId) => ({ orderId }));
      const response = await fetch(`${appConfig.ordersUserUrl}${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordersToUpdate),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // עדכון סטטוס הזמנות ל-2
  async updateOrdersStatusToTwo(orderIds: number[], userId: number): Promise<void> {
    try {
      if (!userId) {
        throw new Error("User ID is undefined.");
      }
      const ordersToUpdate = orderIds.map((orderId) => ({ orderId }));
      const response = await fetch(`${appConfig.ordersUserUrl}${orderIds}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordersToUpdate),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  async getLastOrder(): Promise<OrderModel | null> {
    const allOrders = await this.getAllOrdersByUser(123); // userId הוכנס כדוגמה, יש להחליף אותו במשתנה אמיתי
    if (allOrders.length === 0) return null;
    const lastOrder = allOrders.slice(-1)[0];
    console.log("last order ", lastOrder.orderId);
    return lastOrder;
  },

  // מחיקת הזמנה
  async deleteOrder1(orderId: number): Promise<void> {
    await axios.delete(`${appConfig.shoesUsersUrl1}${orderId}`);
  },

  // מחיקת קטגוריה
  async deleteCategory(categoryId: number): Promise<void> {
    await axios.delete(`${appConfig.categoryshoesUrl}${categoryId}`);
  },

  // קבלת כל ההזמנות של משתמש
  async getAllOrdersByUser(userId: number): Promise<OrderModel[]> {
    console.log(userId);
    try {
      if (!userId) return [];
      const response = await axios.get(`${appConfig.ordersUserUrl}${userId}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching user orders:", err);
      return [];
    }
  },

  // קבלת כל הקטגוריות
  async getAllCategories(): Promise<CategoryShoesModel[]> {
    try {
      const response = await axios.get(appConfig.categoryshoesUrl);
      console.log("getAllCategories", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  },

  // קבלת כל המשתמשים עבור מנהל מערכת

  async getAllUsersForAdmin(): Promise<UserModel[]> {
    try {
      const response = await axios.get<UserModel[]>(appConfig.usersForAdmin);
      console.log("response", response.data)
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      return []; // מקרה קצה: כדי שהקומפיילר לא יתלונן
    }
  },

  // מחיקת משתמש
  async deleteUser(userId: number): Promise<any> {
    try {
      const url = `${appConfig.usersForAdmin}${userId}`;
      const response = await axios.delete(url);
      console.log(`User ID ${userId} deleted successfully via API:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ID ${userId} via API:`, error);
      throw new Error(`Failed to delete user: ${error}`);
    }
  },

  // קבלת כל המלאי שלי
  async getAllMySupply(): Promise<shoesSizeModel[]> {
    try {
      const response = await axios.get(appConfig.mySupplyUrl);
      console.log("getAllMySupply", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching supply:", err);
      return [];
    }
  },

  // קבלת כל ההזמנות החוזרות
  async getAllRepeatOrders(): Promise<OrderModel[]> {
    try {
      const response = await axios.get(appConfig.repeatOrders);
      console.log("getAllRepeatOrders", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching repeat orders:", err);
      return [];
    }
  },

  // קבלת כל ההזמנות בחודש
  async getAllOrdersPerMonth(): Promise<any[]> {
    try {
      const response = await axios.get(appConfig.ordersPerMonth);
      console.log("getAllOrdersPerMonth", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching orders per month:", err);
      return [];
    }
  },

  // עדכון מלאי של מידת נעל
  async updateShoeSizeStock(shoeSizeData: shoesSizeModel): Promise<void> {
    try {
      const url = appConfig.updateSize;
      console.log("Sending update request to URL:", url, "with data:", shoeSizeData);
      const response = await axios.put(url, shoeSizeData);
      console.log("Shoe size stock updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating shoe size stock:", error);
      throw new Error(`Failed to update shoe size stock: ${error}`);
    }
  },

  // עדכון קטגוריה
  async updateCategory(updatedCategory: CategoryShoesModel): Promise<CategoryShoesModel | null> {
    const headers = { "Content-Type": "application/json" };
    const url = appConfig.categoryshoesUrl + updatedCategory.categoryId;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedCategory),
      });
      if (response.ok) {
        const updatedCategoryData = await response.json();
        console.log("Category updated successfully:", updatedCategoryData);
        return updatedCategoryData;
      } else {
        throw new Error(`Error updating category: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      return null;
    }
  },

  // עדכון חווית משתמש
  async updateUserExperience(orderId: number, userExperience: number, userCommentExperience: string): Promise<any> {
    const headers = { "Content-Type": "application/json" };
    const loggedInUserId = JSON.parse(localStorage.getItem("user") || '{}').userData?.userId;
    const url = `${appConfig.creditCardFormUrl}${loggedInUserId}/${orderId}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ userExperience, userCommentExperience }),
      });
      if (response.ok) {
        const responseText = await response.text();
        return responseText;
      } else {
        const errorBody = await response.text();
        console.error(`Error response from server: ${response.status} - ${response.statusText}`, errorBody);
        throw new Error(`Error updating order: ${response.statusText} - ${errorBody}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      return null;
    }
  },

  async updateStatus2(orderId: number, comment: string): Promise<any> {
    const headers = { "Content-Type": "application/json" };
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const loggedInUserId = user.userData?.userId;

    if (!loggedInUserId) {
      throw new Error("User ID not found in localStorage.");
    }

    const url = `${appConfig.ordersUserUrl}${loggedInUserId}/${orderId}`;
    console.log("DEBUG (Frontend Service): Request URL:", url);

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ comment }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log("DEBUG (Frontend Service): Update successful response:", updatedData);
        return updatedData;
      } else {
        const errorBody = await response.text();
        console.error(`DEBUG (Frontend Service): Error response from server: ${response.status} - ${response.statusText}`, errorBody);
        throw new Error(`Error updating order: ${response.statusText} - ${errorBody}`);
      }
    } catch (error) {
      console.error("DEBUG (Frontend Service): Error updating order:", error);
      return null;
    }
  },

  // עדכון מחיר
  async updatePrice(shoes: ShoesModel): Promise<ShoesModel | null> {
    const headers = { "Content-Type": "application/json" };
    const url = `${appConfig.updatePrice}${shoes.shoesId}`;
    console.log("url " + url);

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(shoes),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log("Update successful:", updatedData);
        return updatedData;
      } else {
        throw new Error(`Error updating price: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating price:", error);
      return null;
    }
  },

  // עדכון מוצר
  async updateProduct(updatedProduct: ShoesModel): Promise<ShoesModel | null> {
    const headers = { "Content-Type": "application/json" };
    const url = `${appConfig.shoesUrl}${updatedProduct.shoesId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log("Product updated successfully:", updatedData);
        return updatedData;
      } else {
        throw new Error(`Error updating product: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      return null;
    }
  },

  // עדכון הזמנה
  async updateOrder(updatedOrder: OrderModel): Promise<OrderModel | null> {
    const headers = { "Content-Type": "application/json" };
    const url = `${appConfig.ordersUrl}${updatedOrder.orderId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log("Order updated successfully:", updatedData);
        return updatedData;
      } else {
        const errorData = await response.json();
        throw new Error(`Error updating order: ${response.status} - ${errorData?.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      return null;
    }
  },

  // יצירת נעל חדשה
  async createShoes(newShoesObject: ShoesModel): Promise<ShoesModel> {
    const response = await axios.post(appConfig.shoesUrl, newShoesObject);
    return response.data;
  },

  // טיפול בהזמנה
  async handleOrder(userId: number, shoesId: number, quantity: number, sizeId: number): Promise<void> {
    try {
      const response = await axios.post(`${appConfig.shoesUsersUrl1}${userId}`, {
        userId,
        shoesId,
        quantity,
        sizeId,
      });
      console.log("response.data", response.data);
      console.log("הזמנה הוגשה בהצלחה");
    } catch (error) {
      console.error("Error adding order:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`שגיאה מהשרת: ${error.response.data}`);
      } else {
        alert("שגיאה בהוספת הזמנה");
      }
    } finally {
      // יש להחליף את הקריאה הזו לקוד אמיתי, או להסיר אותה אם אינה נדרשת
      // await this.getAllShoes();
    }
  },

  // בקובץ ה-Service/Logic של ה-Frontend שלך
// בקובץ ה-Service/Logic של ה-Frontend שלך

// [Frontend Service/Logic: dataService.ts]

// import appConfig from "./appConfig.js"; // נניח ש-appConfig קיים

// ... קוד נוסף

// בקובץ DataService.ts (או קובץ השירות הרלוונטי)
// ----------------------------------------------------

// 1. ✅ שינוי: הפונקציה מצהירה כעת שהיא מחזירה Promise<OrderModel>
async handleOrder1(userId: number, shoesId: number, quantity: number, sizeId: number): Promise<OrderModel> {
    try {
        const orderDate = new Date();
        
        // יצירת פורמט התאריך/שעה המתאים ל-MySQL
        const isoString = orderDate.toISOString(); 
        const mysqlDateTime = isoString.slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS

        const dataToSend = {
            userId,
            shoesId,
            quantity,
            sizeId,
            orderDate: mysqlDateTime,
            sale: 0,
            comment: '',
            userExperience: 0,
            userCommentExperience: '',
            status: 0 
        };
        
        // 2. ❗ ודא שה-URL הזה נכון, או שהוא הנתיב ל-POST ב-Backend!
        // (בדרך כלל הנתיב להוספת הזמנה הוא /api/orders או דומה, לא בטוח לגבי shoesUsersUrl1)
        const response = await axios.post(`${appConfig.shoesUsersUrl1}${userId}`, dataToSend);
        
        console.log("הזמנה הוגשה בהצלחה", response.data);
        
        // 3. ✅ התיקון הקריטי: מחזירים את הנתונים המלאים שחזרו מהשרת
        // הנתונים האלה חייבים להיות אובייקט OrderModel הכולל את orderId האמיתי
        return response.data;
        
    } catch (error) {
        console.error("Error adding order:", error);
        // זריקת שגיאה תאפשר ל-onError של useMutation לטפל בה
        throw error; 
    }
},
// export const dataService = { handleOrder1, ... }
// 💡 דוגמה לפונקציה שאתה צריך ליצור כדי לרענן את הסל
/*
async fetchCartItems(userId: number): Promise<void> {
    // נניח שיש לך נתיב שמביא הזמנות לפי משתמש וסטטוס (0)
    const cartUrl = `${appConfig.ordersUserUrl}/${userId}/cart`; 
    const response = await axios.get(cartUrl);
    
    // ⬅️ עדכון ה-State של React/Angular/Vue עם הנתונים החדשים
    this.cartItems = response.data; // או קריאה ל-Store/Redux/Pinia/וכו'
}
*/

  // הוספת תגובה
  async addComment(comment: CommentModel): Promise<CommentModel> {
    try {
      const response = await axios.post(`${appConfig.commentsUrl}`, comment, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("response.data", response.data);
      console.log("תגובה נוספה בהצלחה");
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`שגיאה מהשרת: ${error.response.data}`);
      } else {
        alert("שגיאה בהוספת תגובה");
      }
      throw error;
    }
  },

  // קבלת כל התגובות
  async getAllComments(shoesId: number): Promise<CommentModel[]> {
    try {
      const response = await axios.get(`${appConfig.commentsUrl}${shoesId}`);
      console.log("response.data", response.data);
      console.log("תגובות נטענו בהצלחה");
      return response.data;
    } catch (error) {
      console.error("Error getting comments:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`שגיאה מהשרת: ${error.response.data}`);
      } else {
        alert("שגיאה בטעינת תגובות");
      }
      throw error;
    }
  },
  async getAllFavoritesByUser(userId: number): Promise<FavoriteModel[]> {
    try {
      const response = await axios.get(`${appConfig.favoriteUserUrl}${userId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("שגיאה:", error);
      throw error;
    }
  },

  // יצירת קטגוריה חדשה
  async createCategory(newCategory: CategoryShoesModel): Promise<CategoryShoesModel> {
    const response = await axios.post(appConfig.categoryshoesUrl, newCategory);
    console.log(newCategory); // הצגה לצרכי בדיקה, אפשר להסיר בגרסה סופית
    return response.data;
  },

  // יצירת פריט ביגוד חדש
  // async createClothing(newClothing: ClothingModel): Promise<ClothingModel> {
  //   const response = await axios.post(appConfig.clothingUrl, newClothing);
  //   return response.data;
  // },

  // הוספת פריט מועדף
  async addFavorite(userId: number, shoesId: number): Promise<void> {
    try {
        // ✅ שולחים userId ב-Body, ו-shoesId ב-URL.
        const response = await axios.post(`${appConfig.shoesUsersFavoriteUrl}${shoesId}`, { userId });
        if (response.status === 200) {
            console.log("הלייק נוסף בהצלחה");
        } else {
            console.error("שגיאה בהוספת לייק");
        }
    } catch (error) {
        console.error("שגיאה בהוספת לייק:", error);
        throw error;
    }
},

  // הסרת פריט מועדף
  async removeFavorite(userId: number, shoesId: number): Promise<void> {
    try {
      const response = await axios.delete(`${appConfig.shoesUsersFavoriteUrl}${shoesId}`, { data: { userId } });
      if (response.status === 204) {
        console.log("הלייק הוסר בהצלחה");
      } else {
        console.error("שגיאה בהסרת לייק");
      }
    } catch (error) {
      console.error("שגיאה:", error);
    }
  },

  // בתוך המחלקה DataService
 async getInventoryAlerts(): Promise<any[]> {
    // וודא שהנתיב הזה תואם למה שהגדרת בבקאנד (בקונטרולר)
    const response = await axios.get<any[]>(appConfig.adminAlertsUrl); 
    return response.data;
},

 async getProductReturnAlerts(): Promise<any[]> {
    const response = await axios.get<any[]>(appConfig.adminReturnsUrl); 
    return response.data;
},
async getLaggingProductAlerts(): Promise<any[]> {
        // הנתיב: BASE_URL + "admin/lagging"
        // זהו הנתיב שקורא לראוטר ולפונקציה getLaggingProductAlerts ב-Backend
        const response = await axios.get<any[]>(appConfig.adminLaggingUrl); 
        return response.data;
    }
};

export default dataService;