import dataService from "../Service/DataService";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ShoesModel from "../models/ShoesModel";
import SizeModel from "../models/SizeModel";
import OrderModel from "../models/OrderModel";
import UserModel from "../models/UserModel";
import ProductsCard from "./ProductsCard";
import { NavBarAdmin } from "./NavBarAdmin";
import { Outlet } from "react-router-dom";
import EnrichedShoeModel from "../models/EnrichedShoeModel";

// ממשקים עבור נתוני עגלת הקניות
interface CartItem {
    shoesId: number;
    title: string;
    quantity: number;
    price: number;
    size: number;
    shoppingBasket: number;
}

// ממשק לנתונים שמועברים למוטציה של מחיקת הזמנה
interface DeleteOrderMutationVariables {
    orderId: number;
    shoeId: number;
    updateStock: number | undefined;
}

// ❌ אין צורך להגדיר את EnrichedShoeModel כאן יותר

function Shop() {
    const queryClient = useQueryClient();

    const [totalPrice1, setTotalPrice1] = useState<number>(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [filteredShoes, setFilteredShoes] = useState<ShoesModel[]>([]);

    const loggedInUser = useMemo(() => JSON.parse(localStorage.getItem("user") || '{}'), []);
    const loggedInUserId: number | undefined = loggedInUser?.userData?.userId;
    const updateStock: number | undefined = loggedInUser?.userData?.updateStock;

    // קריאה לנתוני הנעליים
    const {
        data: shoes,
        isLoading: isShoesLoading,
        error: shoesError
    } = useQuery<ShoesModel[], AxiosError>({
        queryKey: ["shoes"],
        queryFn: dataService.getAllShoes,
    });

    const { data: sizes, isLoading: isSizesLoading, error: sizesError } = useQuery<SizeModel[], AxiosError>({
        queryKey: ["sizes"],
        queryFn: dataService.getAllSizes,
    });

    // קריאה לכל ההזמנות
    const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useQuery<OrderModel[], AxiosError>({
        queryKey: ["orders"],
        queryFn: dataService.getAllOrdersPerMonth,
    });

    // קריאה לנתוני המשתמשים
    const {
        data: users,
        isLoading: isUsersLoading,
        error: usersError
    } = useQuery<UserModel[], AxiosError>({
        queryKey: ["users"],
        queryFn: dataService.getAllUsers,
    });

    // שימוש ב-useMemo כדי ליצור מבנה נתונים חדש ועשיר
   // שימוש ב-useMemo כדי ליצור מבנה נתונים חדש ועשיר
const enrichedShoes: EnrichedShoeModel[] = useMemo(() => {
    if (!shoes || !orders || !users) return [];

    const usersMap = new Map<number, UserModel>();
    users.forEach(user => usersMap.set(user.userId, user));

    return shoes.map(shoe => {
        // 1. נמצא את כל ההזמנות הרלוונטיות לנעל הזו
        const shoeOrders = orders.filter(order => order.shoesId === shoe.shoesId);

        // 2. ניצור אובייקט שיסכם את ההזמנות לפי שם לקוח
        const ordersSummary: { [key: string]: number } = {};

        // 3. נעבור על ההזמנות ונסכם אותן
        shoeOrders.forEach(order => {
            const user = usersMap.get(order.userId);
            const customerName = `${user?.firstName || 'Unknown'} ${user?.lastName || 'Customer'}`;
            const quantity = order.total_quantity ?? 0;

            if (ordersSummary[customerName]) {
                // אם הלקוח כבר קיים בסיכום, נוסיף לו את הכמות
                ordersSummary[customerName] += quantity;
            } else {
                // אם זו הפעם הראשונה, ניצור לו רשומה חדשה
                ordersSummary[customerName] = quantity;
            }
        });

        // 4. נהפוך את אובייקט הסיכום בחזרה למערך במבנה הרצוי
        const aggregatedOrders = Object.entries(ordersSummary).map(([name, total]) => ({
            customerName: name,
            total_quantity: total,
        }));

        // 5. נחזיר את הנעל עם רשימת ההזמנות המסוכמת
        return {
            ...shoe,
            orders: aggregatedOrders,
        };
    });
}, [shoes, orders, users]);

    const deleteOrderMutation = useMutation<any, AxiosError, DeleteOrderMutationVariables>({
        mutationFn: ({ orderId, updateStock }) => {
            if (updateStock === 1) {
                return dataService.deleteOrder(orderId);
            } else {
                return dataService.deleteOrder1(orderId);
            }
        },
        onSuccess: (deletedOrderId, variables) => {
            // ... (your existing logic)
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            console.error("Error deleting order:", error);
        },
    });

    const handleAddToCart = (shoe: ShoesModel, selectedSize: SizeModel | undefined) => {
        // ... (your existing logic)
    };

    const deleteOrder = async (shoeIdObject: { shoesId: number }) => {
        // ... (your existing logic, check if it needs updates based on how you fetch orders)
    };

    if (isShoesLoading || isSizesLoading || isOrdersLoading || isUsersLoading) {
        return <div>Loading data...</div>;
    }

    if (shoesError || sizesError || ordersError || usersError) {
        return <div>Error loading data.</div>;
    }

    return (
        <>
            <div>
                <ProductsCard
                    handleAddToCart1={handleAddToCart}
                    deleteOrder={deleteOrder}
                    shoes={enrichedShoes || []}
                    sizes={sizes || []}
                    cartItems={cartItems}
                    totalPrice1={totalPrice1}
                />
            </div>
            <Outlet />
        </>
    );
}

export default Shop


