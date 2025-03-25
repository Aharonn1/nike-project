// import { OkPacket } from "mysql";
// import dal from "../2-utils/dal";
// // import OrderModel from "../4-models/orders";

// interface OrderModel {
//     userId: number;
//     orderId:number
//     user: UserModel; // אובייקט המייצג את המשתמש
//     shoesId: number;
//     quantity: number;
//     orderDate: Date;
//   }
  
//   interface UserModel {
//      userId: number;
//      firstName: string;
//      lastName: string;
//      email: string;
//      password: string;
//     //  role?: RoleModel;
//      updateStock: number;
//      registrationDate: string    // ... שדות נוספים של המשתמש
//   }

// async function buy(order: OrderModel): Promise<void> {
//     try {
//         // הוספת הזמנה לטבלת orders
//         const sqlInsert = "INSERT INTO orders VALUES(DEFAULT,?,?,?,?)";
//         const result: OkPacket = await dal.execute(sqlInsert, order.userId, order.shoesId, order.quantity, order.orderDate);
//         order.orderId = result.insertId;
//         // const user = await getUserById(order.userId); // פונקציה להשגת מידע על המשתמש
//         // console.log("user buy" , user)
//         // const shouldUpdateStock = user.updateStock;  
//         // console.log(order)
//         // if (shouldUpdateStock) {
//             if (order.user && order.user.updateStock !== 0) {
//                 const sqlUpdate = "UPDATE shoes SET stock = stock - ?, bought = bought + ? WHERE shoesId = ?";
//                 await dal.execute(sqlUpdate, order.quantity, order.quantity, order.shoesId);
//             }
//         // }
//         // עדכון טבלת shoes
//         // const sqlUpdate = "UPDATE shoes SET stock = stock - ?, bought = bought + ? WHERE shoesId = ?";
//         // await dal.execute(sqlUpdate, order.quantity, order.quantity, order.shoesId);
//     } catch (error) {
//         console.error('Error adding order:', error);
//     }
// }

// export default {
//  buy
// }