enum OrderStatus {
    Pending = 'Pending',
    Completed = 'Completed',
}

class OrderModel {
    orderId: number;
    sizeId: number;
    userId: number;
    shoesId: number;
    quantity: number;
    status: number;
    orderStatus: OrderStatus = OrderStatus.Pending; // הוספת המשתנה החדש
    orderDate: string = new Date().toISOString().slice(0, 10);

    constructor(order: OrderModel) {
        this.orderId = order.orderId;
        this.sizeId = order.sizeId;
        this.userId = order.userId;
        this.shoesId = order.shoesId;
        this.quantity = order.quantity;
        this.status = order.status;
        this.orderStatus = order.orderStatus; // הוספת המשתנה החדש
        this.orderDate = order.orderDate;
    }
}

export default OrderModel;