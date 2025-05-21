import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import { ResourceNotFoundError } from "./client-errors";
import imageHandler from "../2-utils/image-handler";
import CategoryShoesModel from "./categoryShoes-model";
// import ClothingModel from "./clothing-model";
import OrderModel from "./orders";
import UserModel from "./user-model";
import FavoriteModel from "./favoriteModel";
import ShoesModel from "./shoes-model";
import Size from "./size-model";
import SizeModel from "./size-model";
import ImagesModel from "./images";
import CommentModel from "./commentModel";


async function getAllShoes(): Promise<ShoesModel[]> {
    const sql = `SELECT s.*, COUNT(*) AS numberOfOrders FROM shoes s LEFT JOIN orders o ON s.shoesId = o.shoesId LEFT JOIN users u ON o.userId = u.userId GROUP BY s.shoesId`;
    // const sql = `SELECT s.*,  u.firstName, DATE(o.orderDate) AS orderDate, SUM(o.quantity) AS totalQuantity FROM shoes s LEFT JOIN orders o ON s.shoesId = o.shoesId LEFT JOIN users u ON o.userId = u.userId GROUP BY s.shoesId, u.userId, DATE(o.orderDate)`;
    const tasks = await dal.execute(sql)
    return tasks;
}

async function getAllSizes(): Promise<SizeModel[]> {
    const sql = "SELECT * FROM `size` WHERE 1"
    const tasks = await dal.execute(sql)
    return tasks;
}

async function getAllShoesSizes(shoesId: number): Promise<SizeModel[]> {
    const sql = "SELECT * FROM `shoesize` WHERE shoesId = ?"; // הוספת תנאי WHERE
    const tasks = await dal.execute(sql, shoesId); // העברת shoesId כפרמטר
    return tasks;
}

async function getAllComments(shoesId: number): Promise<any[]> {
    const sql = `
        SELECT comments.*, users.firstName, users.lastName
        FROM comments
        JOIN users ON comments.userId = users.userId
        WHERE comments.shoesId = ?
    `;
    const comments = await dal.execute(sql, shoesId);
    return comments;
}

async function getAllShoesSizes1(): Promise<SizeModel[]> {
    const sql = "SELECT * FROM shoesize"; // הוספת תנאי WHERE
    const tasks = await dal.execute(sql); // העברת shoesId כפרמטר
    return tasks;
}

async function getAllImages(): Promise<ImagesModel[]> {
    const sql = "SELECT * FROM images"; // הוספת תנאי WHERE
    const images = await dal.execute(sql); // העברת shoesId כפרמטר
    return images;
}



async function getAllUsers(): Promise<ShoesModel> {
    const sql = `
   SELECT DISTINCT
    u.firstName,
    u.lastName,
    u.email,
    u.registrationDate,
    o.userId, 
    o.shoesId, 
    DATE(o.orderDate) AS order_date, 
    SUM(o.quantity) AS total_quantity,
    o.status,
    s.price  -- הוספת המחיר
FROM 
    orders o
INNER JOIN 
    users u ON o.userId = u.userId
INNER JOIN  -- הוספת join לטבלת shoes
    shoes s ON o.shoesId = s.shoesId
WHERE o.status = 1
GROUP BY 
    u.firstName, u.lastName, u.registrationDate, o.userId, o.shoesId, DATE(o.orderDate), o.status, s.price 
    ORDER BY
    order_date DESC  -- הוספת s.price ל group by
`;
    const tasks = await dal.execute(sql);
    return tasks;
}

async function getUserAccount(user: UserModel): Promise<UserModel> {
    const sql = `UPDATE users SET 
    firstName = ?,
    lastName = ?,
    email = ?,
    updateStock = ?
    WHERE userId = ?`;
    const result: OkPacket = await dal.execute(sql, user.firstName, user.lastName, user.email, user.updateStock, user.userId);
    if (result.affectedRows === 0) throw new ResourceNotFoundError(user.userId);
    console.log(user)
    return user;
}

// async function buy(order: OrderModel): Promise<void> {
//     try {
//         // הוספת הזמנה לטבלת orders
//         const sqlInsert = "INSERT INTO orders (userId, shoesId, quantity, orderDate, sizeId) VALUES(?, ?, ?, ?, ?)";
//         const result: OkPacket = await dal.execute(sqlInsert, order.userId, order.shoesId, order.quantity, order.orderDate, order.sizeId);
//         order.orderId = result.insertId;
//         console.log(order)
//         // עדכון טבלת shoes
//         const sqlUpdate = "UPDATE shoes SET stock = stock - ?, bought = bought + ? WHERE shoesId = ?";
//         await dal.execute(sqlUpdate, order.quantity, order.quantity, order.shoesId);

//     } catch (error) {
//         console.error('Error adding order:', error);
//     }
// }

async function buyOrder(order: OrderModel): Promise<void> {
    try {
        const sqlUpdate = "UPDATE orders SET status = 1 WHERE orderId = ?";
        await dal.execute(sqlUpdate, order.orderId);
    } catch (error) {
        console.error('Error adding order:', error);
    }
}

async function buy1(order: OrderModel): Promise<void> {
    try {
        // הוספת הזמנה לטבלת orders
        const sqlInsert = "INSERT INTO orders VALUES(DEFAULT,?,?,?,?)";
        const result: OkPacket = await dal.execute(sqlInsert, order.userId, order.shoesId, order.quantity, order.orderDate);
        const sqlUpdateShoeSize = "UPDATE shoesize SET stock = stock - ? WHERE shoesId = ? AND sizeId = ?";
        await dal.execute(sqlUpdateShoeSize, order.quantity, order.shoesId, order.sizeId, order.orderId);
        order.orderId = result.insertId;
        console.log(order)
    } catch (error) {
        console.error('Error adding order:', error);
    }
}



async function deleteOrder(orderId: number): Promise<void> {
    try {
        // קבלת פרטי ההזמנה
        const sqlGetOrder = "SELECT * FROM orders WHERE orderId = ?";
        const order = await dal.execute(sqlGetOrder, orderId);

        if (order.length === 0) {
            throw new Error("הזמנה לא נמצאה");
        }

        // מחיקת ההזמנה
        const sqlDeleteOrder = "DELETE FROM orders WHERE orderId = ?";
        await dal.execute(sqlDeleteOrder, orderId);

        // עדכון טבלת shoes
        const sqlUpdateShoes = "UPDATE shoes SET stock = stock + ?, bought = bought - ? WHERE shoesId = ?";
        await dal.execute(sqlUpdateShoes, order[0].quantity, order[0].quantity, order[0].shoesId);

        const sqlUpdateShoeSize = "UPDATE shoesize SET stock = stock + ? WHERE shoesId = ? AND sizeId = ?";
        await dal.execute(sqlUpdateShoeSize, order[0].quantity, order[0].shoesId, order[0].sizeId);
    } catch (error) {
        console.error('Error canceling order:', error);
    }
}

async function deleteOrder1(orderId: number): Promise<void> {
    try {
        // קבלת פרטי ההזמנה
        const sqlGetOrder = "SELECT * FROM orders WHERE orderId = ?";
        const order = await dal.execute(sqlGetOrder, orderId);

        if (order.length === 0) {
            throw new Error("הזמנה לא נמצאה");
        }

        // מחיקת ההזמנה
        const sqlDeleteOrder = "DELETE FROM orders WHERE orderId = ?";
        await dal.execute(sqlDeleteOrder, orderId);

        // עדכון טבלת shoes
    } catch (error) {
        console.error('Error canceling order:', error);
    }
}

async function deleteLastOrder(): Promise<void> {
    try {
        const allOrders = await this.getAllOrders();

        if (allOrders.length === 0) {
            throw new Error('אין הזמנות למחיקה');
        }

        const lastOrder = allOrders[allOrders.length - 1];
        const lastOrderId = lastOrder.orderId;

        // מחיקת ההזמנה האחרונה יחד עם עדכון המלאי
        await deleteOrder(lastOrderId);
    } catch (error) {
        console.error('Error deleting last order:', error);
    }
}

async function deleteCategory(id: number): Promise<void> {
    const sql = "DELETE FROM categoryshoes WHERE categoryId = ?";
    const result: OkPacket = await dal.execute(sql, id);
    if (result.affectedRows === 0) throw new ResourceNotFoundError(id)
}

async function addShoes(shoes: ShoesModel): Promise<ShoesModel> {

    shoes.imageName = await imageHandler.saveImage(shoes.image);

    const sql = "INSERT INTO shoes VALUES(DEFAULT,?,?,?,?,?,?,?,?)";

    const result: OkPacket = await dal.execute(sql, shoes.categoryId, shoes.description, shoes.price, shoes.title, shoes.bought, shoes.stock, shoes.imageLink, shoes.imageName);

    shoes.shoesId = result.insertId;

    delete shoes.image;

    return shoes;
}

async function unBuy(userId: number, shoesId: number, quantity: number): Promise<void> {
    const sql = "DELETE FROM orders WHERE userID = ? AND quantity = ? AND ";
    await dal.execute(sql, userId, shoesId, quantity)
}

async function getAllOrders(): Promise<OrderModel[]> {
    const sql = `SELECT
    u.firstName AS customer_name,
    u.lastName AS customer_last_name,
    u.registrationDate,
    o.userId,
    o.shoesId,
    p.categoryId, 
    c.categoryName,
    p.title,
    p.imageName, -- הוספנו את שם התמונה
    DATE(o.orderDate) AS order_date,
    SUM(o.quantity) AS total_quantity
    FROM
    orders o
    JOIN users u ON o.userId = u.userId
    JOIN shoes p ON o.shoesId = p.shoesId
    JOIN categoryshoes c ON p.categoryId = c.categoryId
    GROUP BY
    u.firstName, u.lastName, u.registrationDate, o.userId, o.shoesId, p.categoryId, c.categoryName, p.imageName, DATE(o.orderDate)`;
    const orders = await dal.execute(sql)
    return orders;
}

// async function getAllOrdersAndShoesOfUser(): Promise<OrderModel[]> {
//     const sql1 = "SELECT s.title, s.price, o.quantity, o.orderDate,o.sizeId, o.orderId, o.userId, o.shoesId, o.status, (s.price * o.quantity) AS totalPrice FROM shoes s INNER JOIN orders o ON s.shoesId = o.shoesId";
//     const orders = await dal.execute(sql1);
//     return orders;
// }
async function getAllOrdersAndShoesOfUser(userId: number): Promise<OrderModel[]> {
    const sql = `SELECT 
    s.title, 
    s.price,
    s.imageName, 
    o.quantity, 
    o.orderDate,
    o.sizeId, 
    o.orderId, 
    o.userId, 
    o.shoesId, 
    o.status, 
    (s.price * o.quantity) AS itemPrice -- חישוב מחיר פריט בודד
FROM 
    shoes s 
INNER JOIN 
    orders o ON s.shoesId = o.shoesId
    ORDER BY orderDate DESC`;

    const orders = await dal.execute(sql);
    
    // for (const order of orders) {
    //     if (order.orderStatus === order.Pending) {
    //         const orderDate = new Date(order.orderDate);
    //         const currentDate = new Date();

    //         const threeDaysAgo = new Date(currentDate);
    //         threeDaysAgo.setDate(currentDate.getDate() - 3);

    //         if (orderDate <= threeDaysAgo) {
    //             const updateSql = `
    //                 UPDATE orders
    //                 SET orderStatus = ?
    //                 WHERE orderId = ?
    //             `;
    //             await dal.execute(updateSql, order.Completed, order.orderId);
    //             order.orderStatus = order.Completed;
    //             console.log(`הזמנה ${order.orderId} עודכנה ל-Completed.`);
    //         } else {
    //             console.log(`הזמנה ${order.orderId} עדיין לא עברה 3 ימים מאז יצירתה.`);
    //         }
    //     }
    // }

    // for (const order of orders) {
    //     if (order.orderStatus === order.Completed) {
    //         const orderDate = new Date(order.orderDate);
    //         const currentDate = new Date();

    //         const threeDaysAgo = new Date(currentDate);
    //         threeDaysAgo.setDate(currentDate.getDate() - 3);

    //         if (orderDate > threeDaysAgo) {
    //             const updateSql = `
    //                 UPDATE orders
    //                 SET orderStatus = ?
    //                 WHERE orderId = ?
    //             `;
    //             await dal.execute(updateSql, order.Pending, order.orderId);
    //             order.orderStatus = order.Pending;
    //         }

    //         if (orderDate <= threeDaysAgo) {
    //             console.log("orderDate", orderDate);
    //             const updateCompletedSql = `
    //                 UPDATE orders
    //                 SET orderStatus = ?
    //                 WHERE orderId = ?
    //             `;
    //             await dal.execute(updateCompletedSql, order.Completed, order.orderId);
    //             order.orderStatus = order.Completed;
    //         }
    //     }
    // }
    return orders;
}

async function getAllOrdersAndShoesOfUser1(): Promise<OrderModel[]> {
    const sql = `SELECT 
    s.title, 
    s.price,
    s.imageName, 
    o.quantity, 
    o.orderDate,
    o.sizeId, 
    o.orderId, 
    o.userId, 
    o.shoesId, 
    o.status, 
    (s.price * o.quantity) AS itemPrice,
    (
        SELECT SUM(s2.price * o2.quantity) 
        FROM shoes s2 
        INNER JOIN orders o2 ON s2.shoesId = o2.shoesId 
        WHERE o2.userId = o.userId AND o2.status = 1
    ) AS totalPrice
    FROM 
    shoes s 
    INNER JOIN 
    orders o ON s.shoesId = o.shoesId
    WHERE o.status = 0`;
    const orders = await dal.execute(sql);

    if (orders.length > 0) {
        try {
            const updatePromises = orders.map(async (order) => {
                const updateSql = `UPDATE orders SET status = 1 WHERE orderId = ?`;
                await dal.execute(updateSql, order.orderId);
            });
            await Promise.all(updatePromises);
            console.log("Updated order statuses to 1");

        } catch (error) {
            console.error("Error updating order status:", error);
            // חשוב: טפל בשגיאה כראוי (למשל, זרוק שגיאה או החזר ערך שגיאה)
        }
    }
    return orders;
}

async function getAllOrdersAndShoesOfUser2(): Promise<OrderModel[]> {
    const sql = `
       SELECT 
    s.title, 
    s.price,
    s.imageName, 
    o.quantity, 
    o.orderDate,
    o.sizeId, 
    o.orderId, 
    o.userId, 
    o.shoesId, 
    o.status, 
    (s.price * o.quantity) AS itemPrice,
    (
        SELECT SUM(s2.price * o2.quantity) 
        FROM shoes s2 
        INNER JOIN orders o2 ON s2.shoesId = o2.shoesId 
        WHERE o2.userId = o.userId AND o2.orderId = o.orderId AND o2.status = 1
    ) AS orderTotalPrice,
    (
        SELECT SUM(s2.price * o2.quantity)
        FROM shoes s2
        INNER JOIN orders o2 ON s2.shoesId = o2.shoesId
        WHERE o2.userId = o.userId AND o2.status = 1
    ) AS userTotalPrice
    FROM 
    shoes s 
    INNER JOIN 
    orders o ON s.shoesId = o.shoesId
;  -- הוספנו את התנאי הזה!                                             -- הוספנו את התנאי WHERE`;

    const orders = await dal.execute(sql);
    return orders;
}

async function buy(order: OrderModel): Promise<void> {
    try {
        // ... (קוד שליפת מלאי - אם נדרש)

        // הוספת הזמנה עם orderDate
        const sqlInsert = "INSERT INTO orders (userId, shoesId, quantity, sizeId) VALUES(?, ?, ?, ?)";
        const result: OkPacket = await dal.execute(sqlInsert, order.userId, order.shoesId, order.quantity, order.sizeId);
        order.orderId = result.insertId;
        console.log(order);

        // עדכון טבלאות shoes ו shoesize (כמו קודם)
        const sqlUpdateShoes = "UPDATE shoes SET stock = stock - ?, bought = bought + ? WHERE shoesId = ?";
        await dal.execute(sqlUpdateShoes, order.quantity, order.quantity, order.shoesId);

        const sqlUpdateShoeSize = "UPDATE shoesize SET stock = stock - ? WHERE shoesId = ? AND sizeId = ?";
        await dal.execute(sqlUpdateShoeSize, order.quantity, order.shoesId, order.sizeId);

        // // עדכון סטטוס ו orderDate
        // const sqlUpdateOrder = "UPDATE orders SET status = 1 WHERE orderId = ?";
        // await dal.execute(sqlUpdateOrder, order.orderId);

    } catch (error) {
        console.error('Error adding order:', error);
    }
}

async function updateOrdersStatusToOne(orders: OrderModel[], userId: number): Promise<void> {
    if (!orders || orders.length === 0) {
        return;
    }

    try {
        for (const order of orders) {
            if (order.orderId) {
                const sqlUpdateOrder = "UPDATE orders SET status = 1, orderDate = CURRENT_TIMESTAMP WHERE orderId = ? AND userId = ?";
                // תיקון: העברת מערך אחד עם שני הפרמטרים
                const result = await dal.execute(sqlUpdateOrder, [order.orderId], userId);

                console.log("sqlUpdateOrder", sqlUpdateOrder);

                if (result.affectedRows === 0) {
                    console.warn(`No order found with ID: ${order.orderId} for user ${userId}`);
                } else {
                    console.log(`Updated order status to 1 for ID: ${order.orderId} for user ${userId}`);
                }
            } else {
                console.error("Order object is missing orderId:", order);
            }
        }
    } catch (error) {
        console.error("Error setting order statuses to one:", error);
        throw error;
    }
}

async function getAllOrdersAndShoesForAdmin(): Promise<OrderModel[]> {
    const sql1 = "SELECT p.title, SUM(o.quantity) as total_quantity FROM shoes p INNER JOIN orders o ON p.shoesId = o.shoesId GROUP BY p.title";
    const orders = await dal.execute(sql1);
    return orders;
}

async function getAllCategories(): Promise<ShoesModel[]> {
    const sql = `SELECT * FROM categoryshoes`;
    const categoryshoes = await dal.execute(sql)
    return categoryshoes;
}

async function getAllOrders3(): Promise<OrderModel[]> {
    const sql = `SELECT * FROM orders`;
    const orders = await dal.execute(sql)
    return orders;
}

async function getAllClothing(): Promise<ShoesModel[]> {
    const sql = `SELECT * FROM clothing`;
    const tasks = await dal.execute(sql)
    return tasks;
}

async function getShoesByCategory(categoryId: number): Promise<ShoesModel[]> {
    const sql = 'SELECT * FROM shoes WHERE categoryId = ?';
    const category = await dal.execute(sql, categoryId);
    return category;
}

async function addCategory(category: CategoryShoesModel): Promise<CategoryShoesModel> {

    // shoes.imageName = await imageHandler.saveImage(shoes.image);

    const sql = "INSERT INTO categoryshoes VALUES(DEFAULT,?,?)";

    const result: OkPacket = await dal.execute(sql, category.categoryName, category.sale);

    category.categoryId = result.insertId;

    // delete shoes.image;

    return category;
}

// export async function addClothing(clothing: ClothingModel): Promise<ClothingModel> {

//     clothing.imageName = await imageHandler.saveImage(clothing.image);

//     const sql = "INSERT INTO clothing VALUES(DEFAULT,?,?,?,?,?)";

//     const result: OkPacket = await dal.execute(sql, clothing.categoryId, clothing.description, clothing.price, clothing.title, clothing.imageName);

//     clothing.clothingId = result.insertId;

//     delete clothing.image;

//     return clothing;
// }


async function addComment(comment: CommentModel): Promise<CommentModel> {
    const sql = "INSERT INTO comments(userId, shoesId, commentText, commentDate) VALUES(?, ?, ?, NOW())";
    const result: OkPacket = await dal.execute(sql, comment.userId, comment.shoesId, comment.commentText);
    comment.commentId = result.insertId;
    return comment;
}

async function updateCategory(category: CategoryShoesModel): Promise<CategoryShoesModel> {

    const sql = `UPDATE categoryshoes SET 
        categoryName = ?
        WHERE categoryId = ? `;
    const result: OkPacket = await dal.execute(sql, category.categoryName, category.categoryId);

    if (result.affectedRows === 0)
        throw new ResourceNotFoundError(category.categoryId);

    return category;
}

async function updateProduct(shoes: ShoesModel): Promise<ShoesModel> {
    const sql = `UPDATE shoes SET 
        price = ?,
        title = ?,
        description = ?
        WHERE shoesId = ? `;
    const result: OkPacket = await dal.execute(sql, shoes.price, shoes.title, shoes.description, shoes.shoesId);
    if (result.affectedRows === 0)
        throw new ResourceNotFoundError(shoes.shoesId);

    return shoes;
}

async function updateUser(users: UserModel): Promise<UserModel> {

    const sql = `UPDATE users SET 
        shoppingBasket = ?
        WHERE userId = ? `;
    const result: OkPacket = await dal.execute(sql, users.userId);

    if (result.affectedRows === 0)
        throw new ResourceNotFoundError(users.userId);

    return users;
}

async function getOneCategory(id: number): Promise<CategoryShoesModel> {
    const sql = `SELECT 
    categoryId AS categoryId,
    categoryName AS categoryName
    FROM categoryshoes
    WHERE categoryId = ?`;
    const vacations = await dal.execute(sql, id);
    const vacation = vacations[0];
    if (!vacation) throw new ResourceNotFoundError(id);
    return vacation;
}

async function getOneProduct(shoesId: number): Promise<ShoesModel> {
    const sql = `SELECT 
    s.shoesId AS shoesId,
    s.categoryId AS categoryId,
    c.categoryName AS categoryName,  -- הוספת שם הקטגוריה
    s.price AS price,
    s.title AS title,
    s.bought AS bought,
    s.stock AS stock,
    s.imageLink AS imageLink,
    s.imageName AS imageName,
    s.shoppingBasket AS shoppingBasket, 
    s.description AS description,
    s.favorite AS favorite,
    s.imageNameFront AS imageNameFront,
    s.imageNameAbove AS imageNameAbove,
    s.imageNameBack AS imageNameBack,
    s.imageNameDown AS imageNameDown,
    s.video AS video,
    COALESCE(COUNT(f.shoesId), 0) AS total_favorites
    FROM shoes s
    LEFT JOIN favorite f ON s.shoesId = f.shoesId
    JOIN categoryshoes c ON s.categoryId = c.categoryId  --  הצטרפות לטבלת categoryshoes
    WHERE s.shoesId = ?
    GROUP BY s.shoesId;`;
    const vacations = await dal.execute(sql, shoesId);
    const vacation = vacations[0];
    if (!vacation) throw new ResourceNotFoundError(shoesId);
    return vacation;
}

async function getImageNameFromDB(id: number): Promise<string> {
    const sql = "SELECT imageName FROM shoes WHERE shoesId = ?"

    const shoes = await dal.execute(sql, id);

    const shoe = shoes[0];

    if (!shoe) return null;

    return shoes.imageName;
}

async function getAllFavorites(): Promise<FavoriteModel[]> {
    const sql = "SELECT shoesId, COUNT(*) AS total_favorites FROM favorite GROUP BY shoesId";
    console.log("total_favorites", sql)
    const tasks = await dal.execute(sql)
    return tasks;
}

async function getAllFavoritesByUser(userId: number): Promise<any[]> {
    const sql = `
     WITH FavoriteCounts AS (
    SELECT 
        s.shoesId,
        COUNT(f.userId) AS global_total_favorites
    FROM shoes s
    LEFT JOIN favorite f ON s.shoesId = f.shoesId
    GROUP BY s.shoesId
    HAVING COUNT(f.userId) > 0
    )
    SELECT 
    s.*, 
    fc.global_total_favorites,
    c.categoryName  -- הוספת שם הקטגוריה
    FROM shoes s
    JOIN FavoriteCounts fc ON s.shoesId = fc.shoesId
    JOIN favorite f ON s.shoesId = f.shoesId 
    JOIN categoryshoes c ON s.categoryId = c.categoryId  -- הצטרפות לטבלת categoryshoes
    WHERE f.userId = ?
    `;
    console.log("total_favorites", sql, userId);
    const tasks = await dal.execute(sql, [userId]); // הוספנו בחזרה את userId
    return tasks;
}

async function getFavoritesByShoeId(shoeId: number): Promise<FavoriteModel[]> {
    const sql = `SELECT shoesId, COUNT(*) AS total_favorites FROM favorite WHERE shoesId = ${shoeId} GROUP BY shoesId`;
    console.log("total_favorites", sql);
    const tasks = await dal.execute(sql);
    return tasks;
}

async function favorite(userId: number, shoesId: number): Promise<void> {
    const getFavoriteSql = "SELECT favorite FROM shoes WHERE shoesId = ?";
    const insertSql = "INSERT INTO favorite (userId, shoesId) VALUES (?, ?)";
    try {
        const favoriteResult = await dal.execute(getFavoriteSql, shoesId);
        if (favoriteResult.length === 0) {
            throw new Error("הנעל לא נמצאה");
        } else {
            await dal.execute(insertSql, userId, shoesId);
        }
    } catch (error) {
        console.error("שגיאה בטיפול בלייק:", error);
    }
}

// tasksService
async function unfavorite(userId: number, shoesId: number): Promise<void> {
    const sql = "DELETE FROM favorite WHERE userId = ? AND shoesId = ?"; // הוספת userId לתנאי
    try {
        await dal.execute(sql, userId, shoesId);
    } catch (error) {
        console.error("שגיאה במחיקת לייק:", error);
        // טיפול נוסף בשגיאה, למשל זריקת שגיאה מסוג מסוים
    }
}

export default {
    // addClothing,
    addCategory,
    getAllUsers,
    getAllOrders,
    addShoes,
    getAllShoes,
    getShoesByCategory,
    deleteCategory,
    getAllClothing,
    getAllCategories,
    updateCategory,
    getOneCategory,
    updateProduct,
    getAllOrdersAndShoesOfUser,
    buy,
    buy1,
    unBuy,
    updateUser,
    deleteOrder,
    deleteOrder1,
    getUserAccount,
    getAllOrdersAndShoesForAdmin,
    getAllOrders3,
    getOneProduct,
    favorite,
    unfavorite,
    getAllFavorites,
    getFavoritesByShoeId,
    getAllFavoritesByUser,
    getAllSizes,
    getAllShoesSizes,
    getAllShoesSizes1,
    buyOrder,
    updateOrdersStatusToOne,
    getAllOrdersAndShoesOfUser1,
    getAllOrdersAndShoesOfUser2,
    getAllImages,
    addComment,
    getAllComments
    // getAllOrdersAndShoesOfUser1    
}