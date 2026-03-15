// בקובץ OrderModel.ts
export enum OrderStatus { // 💡 הוספנו export לפני ה-enum
    Pending = 'Pending',
    Completed = 'Completed',
    Returned = 'Returned', // הוספת הערך החסר
}

class OrderModel {
    orderId: number = 0;
    sizeId: number = 0;
    userId: number = 0;
    shoesId: number = 0;
    quantity: number = 0;
    status: number = 0;
    sale: number = 0;
    comment: string = '';
    userExperience: number = 0;
    userCommentExperience: string = '';
    orderStatus: OrderStatus = OrderStatus.Pending;
    orderDate: string = new Date().toISOString().slice(0, 10);
    total_quantity?:number = 0
    shoppingBasket?:number = 0;
}

export default OrderModel;