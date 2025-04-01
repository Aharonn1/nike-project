// // shoeSize.js
// enum ShoeSize {
//     size40 = 40,
//     size41 = 41,
//     size42 = 42,
//     size43 = 43,
//     size44 = 44, // תיקון שגיאת כתיב: sie44 -> size44
//     size45 = 45
// }

// export default ShoeSize;

// // orderModel.js

// class OrderModel {
//     orderId = 0;
//     userId = 0;
//     shoesId = 0;
//     quantity = 0;
//     orderDate = ""; 
//     orderStatus = "";
//     size: ShoeSize = ShoeSize.size40; //  הגדרת ערך ברירת מחדל ל-size

//     constructor(order?: Partial<OrderModel>) { //  קבלת order אופציונלי
//         if (order) {
//             Object.assign(this, order); 
//         }
//     }
// }

// export default OrderModel;