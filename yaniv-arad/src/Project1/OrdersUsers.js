import dataService from "../Service/DataService";
import { useState, useEffect } from "react";

export default function OrdersUser(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    console.log("loggedInUser", loggedInUser.userData.userId)

    const initialState = {};
    const reducer = (state, order) => {
        const date = order.orderDate.slice(0, 10).split("-").reverse().join("/");
        const productKey = `${order.title}-${order.sizeId}-${date}`;

        return {
            ...state,
            [productKey]: {
                title: order.title,
                date,
                sizeId: order.sizeId,
                orderStatus: order.orderStatus,
                quantity: (state[productKey]?.quantity || 0) + order.quantity,
                price: (state[productKey]?.price || 0) + order.price,
            },
        };
    };


    useEffect(() => {
        const fetchData = async () => {
            const response = await dataService.getAllOrders2(loggedInUser.userData.userId);
            console.log("response", response)
            const filteredOrders = response.filter(
                (order) => order.userId === loggedInUser.userData.userId && order.status === 1
            );
            console.log(filteredOrders);
            setOrders(filteredOrders);
            setIsLoading(false);
            const groupedOrders = filteredOrders.reduce(reducer, initialState);
            setOrders(Object.values(groupedOrders));
            setIsLoading(false);
        };

        fetchData();
    }, [loggedInUser.userData.userId]);

    useEffect(() => {
        const updatedOrders = orders.map((order) => {
            const orderDate = new Date(order.date.split('/').reverse().join('-'));
            const currentDate = new Date();
            const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;

            if (currentDate - orderDate >= threeDaysInMillis && order.orderStatus === "Pending") {
                return { ...order, orderStatus: "Completed" };
            }
            return order;
        });

        setOrders(updatedOrders);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // פונקציה לספירת ההזמנות
    const countOrders = () => {
        return orders.length;
    };

    

    return (
        <div>
            {/* הצגת מספר ההזמנות הכולל */}
            <p className="total-orders">Total Orders: {countOrders()}</p>

            {isLoading ? (
                <p>Loading orders...</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Size</th>
                            <th>Date</th>
                            <th>Order Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.title + order.date}>
                                <td>{order.title}</td>
                                <td>{order.quantity}</td>
                                <td>{order.price}</td>
                                <td>{order.sizeId}</td>
                                <td>{order.date}</td>
                                <td>{order.orderStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}