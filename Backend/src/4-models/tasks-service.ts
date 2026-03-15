import { OkPacket } from "mysql";
import dal from "../2-utils/dal.js";
import { ResourceNotFoundError } from "../4-models/client-errors.js";
import imageHandler from "../2-utils/image-handler.js";
import CategoryShoesModel from "../4-models/categoryShoes-model.js";
import OrderModel from "../4-models/orders.js";
import UserModel from "../4-models/user-model.js";
import FavoriteModel from "../4-models/favoriteModel.js";
import ShoesModel from "../4-models/shoes-model.js";
import SizeModel from "../4-models/size-model.js";
import ImagesModel from "../4-models/images.js";
import CommentModel from "../4-models/commentModel.js";
import shoesSizeModel from "../4-models/shoes-size.js";

async function getAllShoes(): Promise<ShoesModel[]> {
    const sql = `
 SELECT 
 s.*, 
 COUNT(o.orderId) AS numberOfOrders,
 GROUP_CONCAT(sz.sizeId ORDER BY sz.sizeId) AS availableSizes
 FROM 
 shoes AS s
 LEFT JOIN 
 orders AS o ON s.shoesId = o.shoesId
 LEFT JOIN
 shoesize AS sz ON s.shoesId = sz.shoesId AND sz.stock > 0
 GROUP BY 
 s.shoesId
 `;
    const tasks = await dal.execute(sql);
    return tasks;
}

async function getAllSizes(): Promise<SizeModel[]> {
    const sql = "SELECT * FROM `size` WHERE 1"
    const tasks = await dal.execute(sql)
    return tasks;
}

async function getAllUsersForAdmin(): Promise<UserModel[]> {
    const sql = "SELECT * FROM `users` WHERE 1"
    const users = await dal.execute(sql)
    return users;
}

async function deleteUser(userId: number): Promise<void> {
    try {
        const deleteFavoriteSql = `DELETE FROM favorite WHERE userId = ?`;
        await dal.execute(deleteFavoriteSql, [userId]);
        console.log(`✅ נמחקו לייקים של משתמש ID ${userId}.`);

        const deleteOrdersSql = `DELETE FROM orders WHERE userId = ?`;
        await dal.execute(deleteOrdersSql, [userId]);
        console.log(`✅ נמחקו הזמנות של משתמש ID ${userId}.`);

        const deleteUserSql = `DELETE FROM users WHERE userId = ?`;
        const result: OkPacket = await dal.execute(deleteUserSql, [userId]);

        if (result.affectedRows === 0) {
            console.warn(`⚠️ משתמש ID ${userId} לא נמצא למחיקה.`);
            throw new Error(`משתמש עם ID ${userId} לא נמצא.`);
        }

        console.log(`✅ משתמש ID ${userId} נמחק בהצלחה.`);

    } catch (error: any) {
        console.error(`❌ שגיאה במחיקת משתמש ID ${userId}:`, error);
        throw new Error(`נכשל במחיקת משתמש: ${error.message}`);
    }
}

async function getAllShoesSizes(shoesId: number): Promise<void> {
    const sql = "SELECT * FROM `shoesize` WHERE shoesId = ?"; // הוספת תנאי WHERE
    const params = [shoesId];
    const tasks = await dal.execute(sql, params); // העברת המערך
    return tasks;
}

async function getAllComments(shoesId: number): Promise<any[]> {
    const sql = `
        SELECT comments.*, users.firstName, users.lastName
        FROM comments
        JOIN users ON comments.userId = users.userId
        WHERE comments.shoesId = ?
    `;
    const params = [shoesId];
    const comments = await dal.execute(sql, params);
    return comments;
}

async function getAllShoesSizes1(): Promise<SizeModel[]> {
    const sql = "SELECT * FROM shoesize"; // הוספת תנאי WHERE
    const tasks = await dal.execute(sql); // העברת shoesId כפרמטר
    return tasks;
}

async function getAllCancelOrders(): Promise<OrderModel[]> {
    const sql = `
 SELECT
 O.*,
 S.title,
 U.firstName,
 U.lastName
 FROM
 orders AS O
 JOIN
 shoes AS S ON O.shoesId = S.shoesId
 JOIN
 users AS U ON O.userId = U.userId
 WHERE
 O.status = 2; `;
    const cancelOrders = await dal.execute(sql);
    return cancelOrders;
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
    s.price,  -- הוספת המחיר
    s.title
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

async function updateUserAccount(user: UserModel): Promise<UserModel> {

    const sql = `UPDATE users SET 
        firstName = ?,
        lastName = ?,
        email = ?,
        updateStock = ?
        WHERE userId = ?`;

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    const params = [
        user.firstName,
        user.lastName,
        user.email,
        user.updateStock,
        user.userId // ה-ID תמיד בסוף עבור תנאי WHERE
    ];

    // 2. העברת המערך כארגומנט יחיד
    const result: OkPacket = await dal.execute(sql, params);

    // 3. טיפול בשגיאה
    if (result.affectedRows === 0) {
        // חשוב לוודא שאתה מטפל במקרה שבו המשתמש לא נמצא
        throw new ResourceNotFoundError(user.userId);
    }

    console.log(user);

    return user;
}
async function buyOrder(order: OrderModel): Promise<OrderModel> {

    const sqlUpdate = "UPDATE orders SET status = 1 WHERE orderId = ?";

    // 1. יצירת מערך פרמטרים (חובה!)
    const params = [order.orderId];

    try {
        // 2. העברת המערך כארגומנט השני
        const result: OkPacket = await dal.execute(sqlUpdate, params);

        // 3. בדיקה אם העדכון הצליח
        if (result.affectedRows === 0) {
            // אם לא עודכנה אף שורה, סביר להניח שההזמנה לא קיימת
            throw new ResourceNotFoundError(order.orderId);
        }

        // 4. החזרת אובייקט ההזמנה המעודכן (כדי שה-Controller יוכל להשתמש בו)
        return order;

    } catch (error) {
        console.error('Error updating order status:', error);
        // אם זו לא שגיאת משאב, זורקים את השגיאה הכללית הלאה
        throw error;
    }
}

// הנתיב: tasks-service.ts

async function buy1(order: OrderModel): Promise<OrderModel> {

    // 1. ✅ יצירת תאריך חוקי ל-DB (במקום לסמוך על הקלט או ברירת המחדל)
    const orderDate = new Date(); 
    const mysqlDateTime = orderDate.toISOString().slice(0, 19).replace('T', ' ');
    
    // 2. ⚠️ שמירה על הסטטוס המקורי שנשלח או ברירת מחדל 0 (כדי לא לגעת בלוגיקת הסטטוס)
    const currentStatus = order.status || 0; 

    // הגדרת ה-SQL ל-INSERT
    const sqlInsert = "INSERT INTO orders (userId, shoesId, quantity, orderDate, sizeId, sale, comment, userExperience, userCommentExperience, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // SQL ל-UPDATE המלאי
    const sqlUpdateShoeSize = "UPDATE shoesize SET stock = stock - ? WHERE shoesId = ? AND sizeId = ?";

    // 3. מערך הפרמטרים עבור ה-INSERT
    const insertParams = [
        order.userId,
        order.shoesId,
        order.quantity,
        mysqlDateTime, // ⬅️ שימוש בתאריך שיצרנו (התיקון הקריטי)
        order.sizeId,
        order.sale || 0,
        order.comment || '',
        order.userExperience || 0,
        order.userCommentExperience || '',
        currentStatus // ⬅️ שימוש בסטטוס המקורי (0 או 1)
    ];

    // מערך הפרמטרים עבור ה-UPDATE
    const updateParams = [
        order.quantity,
        order.shoesId,
        order.sizeId
    ];

    let connection: any; // משתנה לטיפול בטרנזקציה

    try {
        // 1. הוספת ההזמנה
        const result: OkPacket = await dal.execute(sqlInsert, insertParams, connection);

        // 2. הפחתת המלאי
        await dal.execute(sqlUpdateShoeSize, updateParams, connection);

        // 3. 💾 עדכון אובייקט ההזמנה המוחזר עם הנתונים האמיתיים
        order.orderId = result.insertId;
        order.orderDate = mysqlDateTime; // ⬅️ עדכון התאריך החוקי המוחזר ל-Front-End
        // אין צורך לעדכן את order.status כיוון שהערך שלו כבר נשמר ב-currentStatus

        console.log(order);
        return order;

    } catch (error) {
        // טיפול בשגיאות
        // if (connection) await dal.rollback(connection);

        console.error('Error adding order:', error);
        throw error;
    }
}

async function deleteOrder(orderId: number): Promise<void> {

    const sqlGetOrder = "SELECT quantity, shoesId, sizeId FROM orders WHERE orderId = ?";
    const sqlDeleteOrder = "DELETE FROM orders WHERE orderId = ?";
    const sqlUpdateShoes = "UPDATE shoes SET stock = stock + ?, bought = bought - ? WHERE shoesId = ?";
    const sqlUpdateShoeSize = "UPDATE shoesize SET stock = stock + ? WHERE shoesId = ? AND sizeId = ?";

    let connection: any;
    let order: any[];

    try {
        // 1. 💡 התחלת הטרנזקציה
        // 🚨 הוספה: קבלת אובייקט החיבור מה-Pool
        connection = await dal.beginTransaction();

        // --- שלב 1: שליפת נתוני ההזמנה ---
        order = await dal.execute(sqlGetOrder, [orderId], connection);

        if (order.length === 0) {
            // אם לא נמצא, מבצעים Rollback ומדווחים על שגיאה
            await dal.rollback(connection);
            throw new ResourceNotFoundError(orderId);
        }

        const { quantity, shoesId, sizeId } = order[0];

        // --- שלב 2: מחיקת ההזמנה ---
        await dal.execute(sqlDeleteOrder, [orderId], connection);

        // --- שלב 3: החזרת מלאי כללי ---
        const shoesParams = [quantity, quantity, shoesId];
        await dal.execute(sqlUpdateShoes, shoesParams, connection);

        // --- שלב 4: החזרת מלאי מידה ספציפית ---
        const shoeSizeParams = [quantity, shoesId, sizeId];
        await dal.execute(sqlUpdateShoeSize, shoeSizeParams, connection);

        // 5. ✅ אישור וסיום הטרנזקציה
        // 🚨 הוספה: מחזיר את החיבור ל-Pool
        await dal.commit(connection);

    } catch (error) {
        // בכישלון: ביטול כל הפעולות שבוצעו והחזרת החיבור ל-Pool
        if (connection) await dal.rollback(connection);

        console.error('Error canceling order:', error);
        throw error;
    }
}

async function deleteOrder1(orderId: number): Promise<void> {

    // 1. הגדרת פרמטרים כראוי (מערך יחיד)
    const params = [orderId];

    try {
        // --- שלב 1: שליפת ההזמנה ---
        const sqlGetOrder = "SELECT * FROM orders WHERE orderId = ?";
        // 🚨 תיקון: שליחה כארגומנט שני (המערך)
        const order = await dal.execute(sqlGetOrder, params);

        if (order.length === 0) {
            // 🚨 תיקון: זריקת שגיאת משאב לא נמצא (404)
            throw new ResourceNotFoundError(orderId);
        }

        // --- שלב 2: מחיקת ההזמנה ---
        const sqlDeleteOrder = "DELETE FROM orders WHERE orderId = ?";
        // 🚨 תיקון: שליחה כארגומנט שני (המערך)
        const result: OkPacket = await dal.execute(sqlDeleteOrder, params);

        // בדיקה נוספת: אם למרות ה-SELECT לא נמחקה שום שורה.
        if (result.affectedRows === 0) {
            throw new ResourceNotFoundError(orderId);
        }

    } catch (error) {
        console.error('Error deleting order:', error);
        // זורקים את השגיאה הלאה ל-Controller
        throw error;
    }
}

async function deleteCategory(id: number): Promise<void> {

    // 1. הגדרת פרמטרים (חובה: מערך יחיד)
    const params = [id];

    const sql = "DELETE FROM categoryshoes WHERE categoryId = ?";

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    // 3. בדיקת שגיאות
    if (result.affectedRows === 0) {
        // זורקים שגיאת משאב לא נמצא
        throw new ResourceNotFoundError(id);
    }
}

async function addShoes(shoes: ShoesModel): Promise<ShoesModel> {

    // 1. שמירת התמונה ועדכון שם הקובץ
    // shoes.imageName = await imageHandler.saveImage(shoes.image);

    const sql = "INSERT INTO shoes VALUES(DEFAULT,?,?,?,?,?,?,?,?)"; // 9 סימני שאלה

    // 2. יצירת מערך פרמטרים מסודר (חובה!)
    const params = [
        shoes.categoryId,
        shoes.description,
        shoes.price,
        shoes.title,
        shoes.bought,
        shoes.stock,
        shoes.imageLink,
        shoes.imageName
        // סך הכל 8 פרמטרים שמוכנסים ל-8 סימני השאלה
        // ה-DEFAULT מטפל ב-shoesId
    ];

    // 3. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    // 4. עדכון והחזרה
    shoes.shoesId = result.insertId;

    // 5. הסרת אובייקט התמונה (שכבר נשמר)
    // delete shoes.image;

    return shoes;
}

async function unBuy(userId: number, shoesId: number, quantity: number): Promise<void> {

    const sql = "DELETE FROM orders WHERE userID = ? AND shoesId = ? AND quantity = ?";

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    const params = [userId, shoesId, quantity];

    // 2. העברת המערך כארגומנט השני
    // 🚨 תיקון: שולחים את המערך 'params'
    await dal.execute(sql, params);

    // הערה: מומלץ להוסיף טיפול בשגיאות (כמו בדיקת affectedRows) אם המשתמש לא נמצא
}

async function getAllOrders(): Promise<OrderModel[]> {
    const sql = `SELECT
    u.firstName AS customer_name,
    u.lastName AS customer_last_name,
    u.registrationDate,
    o.userId,
    o.shoesId,
    o.sale,
    o.userExperience,
    o.userCommentExperience,
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
    u.firstName, u.lastName, u.registrationDate, o.userId, o.shoesId, p.categoryId, c.categoryName,o.userExperience,o.userCommentExperience, p.imageName, DATE(o.orderDate)`;
    const orders = await dal.execute(sql)
    return orders;
}

async function getAllOrdersPerMonth(): Promise<OrderModel[]> {
    const sql = `
        -- יצירת טבלת עזר זמנית של כל 12 החודשים עם שמם באנגלית
        WITH months AS (
            SELECT 1 AS month_num, 'January' AS month_name UNION ALL
            SELECT 2, 'February' UNION ALL
            SELECT 3, 'March' UNION ALL
            SELECT 4, 'April' UNION ALL
            SELECT 5, 'May' UNION ALL
            SELECT 6, 'June' UNION ALL
            SELECT 7, 'July' UNION ALL
            SELECT 8, 'August' UNION ALL
            SELECT 9, 'September' UNION ALL
            SELECT 10, 'October' UNION ALL
            SELECT 11, 'November' UNION ALL
            SELECT 12, 'December'
        )
        SELECT
            O.orderId,
            O.userId,
            O.shoesId,
            O.sale,
            O.comment,
            O.quantity,
            DATE(O.orderDate) AS orderDate,
            YEAR(O.orderDate) AS order_year,
            MONTH(O.orderDate) AS order_month,
            S.title AS shoeTitle,
            U.firstName,
            U.lastName,
            M.month_name -- 💡 שינוי כאן: הוספת שם החודש מתוך טבלת העזר
        FROM
            orders AS O
        JOIN
            shoes AS S ON O.shoesId = S.shoesId
        JOIN
            users AS U ON O.userId = U.userId
        JOIN
            months AS M ON MONTH(O.orderDate) = M.month_num
            WHERE
        O.status = 1
        ORDER BY
            O.orderDate DESC;
    `;
    const orders = await dal.execute(sql);
    return orders;
}

async function getAllOrdersAndShoesOfUser(userId: number): Promise<OrderModel[]> {
    const sql = `SELECT 
    s.title, 
    s.price,
    s.imageName,
    s.shoppingBasket, 
    o.quantity, 
    o.orderDate,
    o.sizeId, 
    o.orderId, 
    o.userId,
    o.userExperience, 
    o.userCommentExperience,
    o.shoesId, 
    o.status,
    o.sale,
    o.orderStatus, 
    u.firstName, -- 💡 הוספת שם פרטי של הלקוח
    u.lastName, -- 💡 הוספת שם משפחה של הלקוח
    (s.price * o.quantity) AS itemPrice
FROM 
    shoes AS s 
INNER JOIN 
    orders AS o ON s.shoesId = o.shoesId
INNER JOIN 
    users AS u ON o.userId = u.userId -- 💡 חיבור לטבלת users
    ORDER BY 
    orderDate DESC;`;

    const orders = await dal.execute(sql);

    for (const order of orders) {
        if (order.orderStatus === order.Pending) {
            const orderDate = new Date(order.orderDate);
            const currentDate = new Date();

            const threeDaysAgo = new Date(currentDate);
            threeDaysAgo.setDate(currentDate.getDate() - 3);

            if (orderDate <= threeDaysAgo) {
                const updateSql = `
                    UPDATE orders
                    SET orderStatus = ?
                    WHERE orderId = ?
                `;
                await dal.execute(updateSql, order.Completed, order.orderId);
                order.orderStatus = order.Completed;
                console.log(`הזמנה ${order.orderId} עודכנה ל-Completed.`);
            } else {
                console.log(`הזמנה ${order.orderId} עדיין לא עברה 3 ימים מאז יצירתה.`);
            }
        }
    }

    for (const order of orders) {
        if (order.orderStatus === order.Completed) {
            const orderDate = new Date(order.orderDate);
            const currentDate = new Date();

            const threeDaysAgo = new Date(currentDate);
            threeDaysAgo.setDate(currentDate.getDate() - 3);

            if (orderDate > threeDaysAgo) {
                const updateSql = `
                    UPDATE orders
                    SET orderStatus = ?
                    WHERE orderId = ?
                `;
                await dal.execute(updateSql, order.Pending, order.orderId);
                order.orderStatus = order.Pending;
            }

            if (orderDate <= threeDaysAgo) {
                console.log("orderDate", orderDate);
                const updateCompletedSql = `
                    UPDATE orders
                    SET orderStatus = ?
                    WHERE orderId = ?
                `;
                await dal.execute(updateCompletedSql, order.Completed, order.orderId);
                order.orderStatus = order.Completed;
            }
        }
    }
    return orders;
}

async function getAllOrdersAndShoesOfUser3(userId: number): Promise<OrderModel[]> {
    const sql = `SELECT 
    s.title, 
    s.price,
    s.imageName,
    s.shoppingBasket, 
    o.quantity, 
    o.orderDate,
    o.sizeId, 
    o.orderId, 
    o.userId,
    o.userExperience, 
    o.userCommentExperience,
    o.shoesId, 
    o.status,
    o.sale,
    o.orderStatus, 
    u.firstName, -- 💡 הוספת שם פרטי של הלקוח
    u.lastName, -- 💡 הוספת שם משפחה של הלקוח
    (s.price * o.quantity) AS itemPrice
FROM 
    shoes AS s 
INNER JOIN 
    orders AS o ON s.shoesId = o.shoesId
INNER JOIN 
    users AS u ON o.userId = u.userId -- 💡 חיבור לטבלת users
    ORDER BY 
    orderDate DESC;`;

    const orders = await dal.execute(sql);

    return orders;
}


// async function getAllOrdersAndShoesOfUser3(userId: number): Promise<OrderModel[]> {
//     const sql = `
//         SELECT
//             s.title,
//             s.price,
//             s.imageName,
//             o.quantity,
//             o.orderDate,
//             o.sizeId,
//             o.orderId,
//             o.userId,
//             o.userExperience,
//             o.userCommentExperience,
//             o.shoesId,
//             o.status,
//             o.sale,
//             o.orderStatus,
//             u.firstName,
//             u.lastName,
//             (s.price * o.quantity) AS itemPrice
//         FROM
//             shoes AS s
//         INNER JOIN
//             orders AS o ON s.shoesId = o.shoesId
//         INNER JOIN
//             users AS u ON o.userId = u.userId
//         WHERE
//             o.userId = ? 
//             AND o.status = 3 -- סטטוס 0 עבור סל קניות / הזמנות פתוחות
//         ORDER BY
//             o.orderDate DESC;`;

//     // 1. מבצעים את השאילתה המרכזית
//     const orders = await dal.execute(sql, [userId]);
//     const ordersWithUpdates = [...orders]; // עותק למניפולציה

//     const currentDate = new Date();
//     const threeDaysAgo = new Date(currentDate);
//     threeDaysAgo.setDate(currentDate.getDate() - 3);

//     // 2. עוברים על ההזמנות פעם אחת בלבד כדי לבדוק ולעדכן את הסטטוס
//     for (const order of ordersWithUpdates) {
//         // בודקים רק הזמנות שעדיין בסטטוס Pending
//         if (order.orderStatus === order.Pending) { 
//             const orderDate = new Date(order.orderDate);

//             // אם עברו 3 ימים או יותר
//             if (orderDate <= threeDaysAgo) { 

//                 // 2.1. עדכון למסד הנתונים
//                 const updateSql = `
//                     UPDATE orders
//                     SET orderStatus = ?
//                     WHERE orderId = ?
//                 `;
//                 // שימו לב: אם order.Completed ו-order.Pending הם קבועים (Constants) שלא נשלפים מה-DB, צריך להשתמש בערכים שלהם (למשל: 1, 2)
//                 await dal.execute(updateSql, [order.Completed, order.orderId]);

//                 // 2.2. עדכון האובייקט בזיכרון (כדי שהמשתמש יקבל את הסטטוס המעודכן מיד)
//                 order.orderStatus = order.Completed;
//                 console.log(`✅ הזמנה ${order.orderId} עודכנה ל-Completed.`);
//             } else {
//                 console.log(`הזמנה ${order.orderId} עדיין לא עברה 3 ימים מאז יצירתה.`);
//             }
//         }

//         // הערה: הסרנו את הלולאה השנייה המיותרת, כי תפקידה היה רק לבטל את העדכון אם בוצע מוקדם מדי,
//         // וליצור קריאות כפולות ל-UPDATE אם עברו 3 ימים.
//     }

//     // 3. מחזירים את מערך ההזמנות (עם העדכון בזיכרון)
//     return ordersWithUpdates;
// }

// async function buy(order: OrderModel): Promise<void> {
//     try {

//         const sqlInsert = `
//             INSERT INTO orders (userId, shoesId, quantity, sizeId, orderDate, status, sale, comment, userExperience, userCommentExperience) 
//             VALUES (?, ?, ?, ?, NOW(), ?, 0, '', 0, '')`; 

//         const result: OkPacket = await dal.execute(
//             sqlInsert,
//             order.userId,
//             order.shoesId,
//             order.quantity,
//             order.sizeId,
//             3 // ⬅️ הערך החדש עבור "עגלה פעילה"
//         );
//         order.orderId = result.insertId;
//         console.log(order);

//         const sqlUpdateShoes = "UPDATE shoes SET stock = stock - ?, bought = bought + ? WHERE shoesId = ?";
//         await dal.execute(sqlUpdateShoes, [order.quantity, order.quantity, order.shoesId]);

//         const sqlUpdateShoeSize = "UPDATE shoesize SET stock = stock - ? WHERE shoesId = ? AND sizeId = ?";
//         await dal.execute(sqlUpdateShoeSize, [order.quantity, order.shoesId, order.sizeId]);

//     } catch (error) {
//         console.error('Error adding order:', error);
//     }
// }

async function updateOrdersStatusToOne(orders: OrderModel[], userId: number): Promise<void> {
    // הוספת בדיקת הקלט חזרה (זהו קוד הגנתי חשוב)
    try {
        for (const order of orders) {
            if (order.orderId) {
                // ✅ התיקון: הסרת הפסיק המיותר אחרי 'status = 1'
                const sqlUpdateOrder = "UPDATE orders SET status = 1 WHERE orderId = ? AND userId = ?";

                // ✅ בדיקה תקינה - הפרמטרים מועברים בסדר הנכון לשני סימני השאלה
                const result: any = await dal.execute(sqlUpdateOrder, [order.orderId, userId]);

                console.log("sqlUpdateOrder:", sqlUpdateOrder);

                if (result.affectedRows === 0) {
                    console.warn(`No order found with ID: ${order.orderId} for user ${userId} (Order may have been previously updated or belongs to another user)`);
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

async function getShoesByCategory(categoryId: number): Promise<ShoesModel[]> {

    const sql = 'SELECT * FROM shoes WHERE categoryId = ?';

    // 1. יצירת מערך פרמטרים (חובה!)
    const params = [categoryId];

    // 2. העברת המערך כארגומנט השני
    const category = await dal.execute(sql, params);

    return category;
}

async function addCategory(category: CategoryShoesModel): Promise<CategoryShoesModel> {

    const sql = "INSERT INTO categoryshoes VALUES(DEFAULT,?,?)";

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    const params = [category.categoryName, category.sale];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    category.categoryId = result.insertId;

    return category;
}

async function addComment(comment: CommentModel): Promise<CommentModel> {

    const sql = "INSERT INTO comments(userId, shoesId, commentText, commentDate) VALUES(?, ?, ?, NOW())";

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [userId, shoesId, commentText]
    const params = [
        comment.userId,
        comment.shoesId,
        comment.commentText
    ];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    // 3. עדכון והחזרה
    comment.commentId = result.insertId;

    return comment;
}

async function updateCategory(category: CategoryShoesModel): Promise<CategoryShoesModel> {

    const sql = `UPDATE categoryshoes SET 
        categoryName = ?
        WHERE categoryId = ? `;

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הפרמטרים חייבים להיות בסדר שבו הם מופיעים ב-SQL: [SET, WHERE]
    const params = [category.categoryName, category.categoryId];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new ResourceNotFoundError(category.categoryId);
    }

    return category;
}
async function updateUserExperience(orderId: number, userId: number, userExperience: number, userCommentExperience: string): Promise<void> {

    const sqlUpdateOrder = "UPDATE orders SET userExperience = ?, userCommentExperience = ? WHERE orderId = ? AND userId = ?";

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [userExperience, userCommentExperience, orderId, userId]
    const params = [
        userExperience,
        userCommentExperience,
        orderId,
        userId
    ];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sqlUpdateOrder, params);

    if (result.affectedRows === 0) {
        throw new ResourceNotFoundError(orderId);
    }

    console.log(`Updated comment: ${userCommentExperience} and rating : ${userExperience} for Order ID: ${orderId} by User ID: ${userId}.`);
}

async function updateOrderStatus2(orderId: number, userId: number, comment: string): Promise<void> {

    const newStatus = 2;

    const sqlUpdateOrder = "UPDATE orders SET status = ?, comment = ? WHERE orderId = ? AND userId = ?";

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [status, comment, orderId, userId]
    const params = [newStatus, comment, orderId, userId];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sqlUpdateOrder, params);

    if (result.affectedRows === 0) {
        console.warn(`Update failed: Order ID ${orderId} not found or not owned by user ${userId}, or status already updated.`);
        throw new ResourceNotFoundError(orderId);
    } else {
        console.log(`Updated order status to ${newStatus} for ID: ${orderId} and User ID: ${userId} with comment: ${comment}`);
    }
}
async function updateProduct(shoes: ShoesModel): Promise<ShoesModel> {

    const sql = `UPDATE shoes SET 
        price = ?,
        title = ?,
        description = ?
        WHERE shoesId = ? `;

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [price, title, description, shoesId]
    const params = [
        shoes.price,
        shoes.title,
        shoes.description,
        shoes.shoesId // תמיד בסוף עבור תנאי WHERE
    ];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new ResourceNotFoundError(shoes.shoesId);
    }

    return shoes;
}

// async function updateUser(users: UserModel): Promise<UserModel> {

//     const sql = `UPDATE users SET 
//         shoppingBasket = ?
//         WHERE userId = ? `;

//     // 🎯 התיקון: מעביר את שני הערכים הנדרשים (העגלה ואז ה-ID)
//     const result: OkPacket = await dal.execute(sql, users.shoppingBasket, users.userId); 

//     if (result.affectedRows === 0)
//         throw new ResourceNotFoundError(users.userId);

//     return users;
// }

async function updatePrice(shoes: ShoesModel): Promise<ShoesModel> {

    const sql = `UPDATE shoes SET 
        price = ?
        WHERE shoesId = ? `;

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [price, shoesId]
    const params = [
        shoes.price,
        shoes.shoesId // תמיד בסוף עבור תנאי WHERE
    ];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new ResourceNotFoundError(shoes.shoesId);
    }

    return shoes;
}

async function getOneCategory(id: number): Promise<CategoryShoesModel> {

    const sql = `SELECT 
        categoryId AS categoryId,
        categoryName AS categoryName
        FROM categoryshoes
        WHERE categoryId = ?`;

    // 1. יצירת מערך פרמטרים (חובה!)
    const params = [id];

    // 2. העברת המערך כארגומנט השני
    // 🚨 תיקון: שליחת המערך 'params' במקום ה-id לבד
    const categories = await dal.execute(sql, params);

    const category = categories[0];

    // 3. בדיקת שגיאות
    if (!category) {
        throw new ResourceNotFoundError(id);
    }

    return category;
}

async function getOneProduct(shoesId: number): Promise<ShoesModel> {
console.log(`--- DB LOGIC: Attempting to retrieve product ID ${shoesId} ---`);
    const sql = `SELECT 
        s.shoesId AS shoesId,
        s.categoryId AS categoryId,
        c.categoryName AS categoryName,
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
        JOIN categoryshoes c ON s.categoryId = c.categoryId
        WHERE s.shoesId = ?
        GROUP BY s.shoesId;`;

    // 1. יצירת מערך פרמטרים (חובה!)
    const params = [shoesId];

    // 2. העברת המערך כארגומנט השני
    // 🚨 תיקון: שליחת המערך 'params' במקום ה-shoesId לבד
    const products = await dal.execute(sql, params);

    const product = products[0];

    // 3. בדיקת שגיאות
    if (!product) {
        throw new ResourceNotFoundError(shoesId);
    }

    return product;
}

async function getAllFavorites(): Promise<FavoriteModel[]> {
    const sql = "SELECT shoesId, COUNT(*) AS total_favorites FROM favorite GROUP BY shoesId";
    console.log("total_favorites", sql)
    const tasks = await dal.execute(sql)
    return tasks;
}

async function getAllMySupply(): Promise<ShoesModel[]> {
    const sql = `SELECT
    s.shoesId,      -- מזהה הנעל
    s.title,        -- שם הנעל (מטבלת shoes)
    sz.sizeId,      -- מזהה המידה (מטבלת shoesize)
    sz.stock        -- כמות המלאי למידה זו (מטבלת shoesize)
    FROM
    shoes AS s      -- הטבלה הראשית (נעליים), עם כינוי 's'
    JOIN
    shoesize AS sz  -- הטבלה המשנית (מלאי מידות), עם כינוי 'sz'
    ON
    s.shoesId = sz.shoesId; -- תנאי הצירוף: התאמה בין מזהה הנעל בשתי הטבלאות`;
    console.log("getAllMySupply", sql)
    const mySupply = await dal.execute(sql)
    return mySupply;
}

// נניח ש-shoesSizeModel הוא שם המודל התקין שלך
async function updateShoeSizeStock(shoeSizeData: shoesSizeModel): Promise<void> {

    const sql = `
        UPDATE shoesize
        SET stock = ?
        WHERE shoesId = ? AND sizeId = ?;
    `;

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [stock, shoesId, sizeId]
    const params = [
        shoeSizeData.stock,
        shoeSizeData.shoesId,
        shoeSizeData.sizeId
    ];

    try {
        // 2. העברת המערך כארגומנט השני
        // 🚨 תיקון: שולחים את המערך 'params' במקום הפרמטרים בנפרד
        const result: OkPacket = await dal.execute(sql, params);

        if (result.affectedRows === 0) {
            console.warn(`⚠️ לא נמצאה רשומה לעדכון: נעל ID ${shoeSizeData.shoesId}, מידה ID ${shoeSizeData.sizeId}.`);
            // מומלץ להשתמש ב-ResourceNotFoundError במקום Error כללי
            throw new Error(`מידה ${shoeSizeData.sizeId} עבור נעל ${shoeSizeData.shoesId} לא נמצאה לעדכון.`);
        }

        console.log(`✅ עודכן מלאי בהצלחה: נעל ID ${shoeSizeData.shoesId}, מידה ID ${shoeSizeData.sizeId}, מלאי חדש ${shoeSizeData.stock}`);
    } catch (error: any) {
        console.error(`❌ שגיאה בעדכון מלאי עבור נעל ${shoeSizeData.shoesId}, מידה ${shoeSizeData.sizeId}:`, error);
        // זורק את השגיאה המקורית או שגיאה עטופה
        throw error;
    }
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
        // 1. בדיקה האם הנעל קיימת
        // 🚨 תיקון: שליחה במערך
        const shoesParams = [shoesId];
        const favoriteResult = await dal.execute(getFavoriteSql, shoesParams);

        if (favoriteResult.length === 0) {
            // זורקים שגיאת משאב לא נמצא
            throw new ResourceNotFoundError(shoesId);
        }

        // 2. הוספה לטבלת favorite
        // 🚨 תיקון: שליחה במערך
        const insertParams = [userId, shoesId];
        await dal.execute(insertSql, insertParams);

    } catch (error) {
        // זורקים את השגיאה הלאה במקום רק להדפיס אותה
        console.error("שגיאה בטיפול בלייק:", error);
        throw error;
    }
}

async function unfavorite(userId: number, shoesId: number): Promise<void> {

    const sql = "DELETE FROM favorite WHERE userId = ? AND shoesId = ?";

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    const params = [userId, shoesId];

    try {
        // 2. העברת המערך כארגומנט השני
        const result: OkPacket = await dal.execute(sql, params);

        // הערה: אין צורך לזרוק ResourceNotFoundError אם affectedRows הוא 0,
        // כיוון שמחיקת לייק שלא קיים היא הצלחה פונקציונלית.

        if (result.affectedRows === 0) {
            console.warn(`הסרת לייק נכשלה: משתמש ${userId} לא סימן את נעל ${shoesId} כמועדפת.`);
        } else {
            console.log(`הוסר לייק בהצלחה עבור משתמש ${userId} ונעל ${shoesId}.`);
        }

    } catch (error) {
        // זורקים את השגיאה הלאה ל-Controller לטיפול ברמה גבוהה יותר (למשל, שגיאת שרת 500)
        console.error("שגיאה במחיקת לייק:", error);
        throw error;
    }
}

async function getUserAccount(user: UserModel): Promise<UserModel> {

    const sql = `UPDATE users SET 
        firstName = ?,
        lastName = ?,
        email = ?,
        updateStock = ?
        WHERE userId = ?`;

    // 1. יצירת מערך פרמטרים מסודר (חובה!)
    // הסדר חייב להיות: [SET values, WHERE values]
    const params = [
        user.firstName,
        user.lastName,
        user.email,
        user.updateStock,
        user.userId
    ];

    // 2. העברת המערך כארגומנט השני
    const result: OkPacket = await dal.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new ResourceNotFoundError(user.userId);
    }

    console.log(user);

    return user;
}

export default {
    addCategory,
    getAllUsers,
    getAllOrders,
    addShoes,
    getAllShoes,
    getShoesByCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
    getOneCategory,
    updateProduct,
    getAllOrdersAndShoesOfUser,
    getAllOrdersAndShoesOfUser3,
    // buy,
    buy1,
    unBuy,
    // updateUser,
    deleteOrder,
    deleteOrder1,
    getUserAccount,
    getAllOrdersAndShoesForAdmin,
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
    getAllImages,
    addComment,
    getAllComments,
    updatePrice,
    getAllMySupply,
    updateShoeSizeStock,
    getAllUsersForAdmin,
    deleteUser,
    updateOrderStatus2,
    getAllCancelOrders,
    getAllOrdersPerMonth,
    updateUserExperience
}