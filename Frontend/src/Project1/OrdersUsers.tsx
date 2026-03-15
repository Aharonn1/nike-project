import React, { useState, useMemo } from "react";
import dataService from "../Service/DataService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import OrderModel from "../models/OrderModel";

// --- Interfaces ---
interface OrderWithDetails extends OrderModel {
    title: string; price: number; imageName: string; originalPrice?: number; date: string; shoppingBasket?: number;
}
interface GroupedOrder extends OrderWithDetails {
    orderId: number; originalPrice: number; sale: number;
}

const getDisplayStatusText = (status: number, orderDate: string | undefined): string => {
    if (status === 2) return "Returned";
    if (!orderDate || typeof orderDate !== 'string') return "In Process";
    try {
        const parts = orderDate.split('/');
        const orderDateObject = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        const daysPassed = (Date.now() - orderDateObject.getTime()) / (1000 * 60 * 60 * 24);
        return daysPassed > 3 ? "Delivered" : "Shipping";
    } catch (e) { return "In Process"; }
};

export default function OrdersUser() {
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>("");
    const loggedInUser = useMemo(() => JSON.parse(localStorage.getItem("user") || '{}'), []);
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading } = useQuery<GroupedOrder[], AxiosError>({
        queryKey: ["userOrders", loggedInUser?.userData?.userId],
        queryFn: async () => {
            if (!loggedInUser?.userData?.userId) return [];
            const allOrdersResponse = await dataService.getAllOrdersByUser(loggedInUser.userData.userId) as OrderWithDetails[];
            const filteredOrders = allOrdersResponse.filter(order => order.userId === loggedInUser.userData.userId && (order.status === 1 || order.status === 2));
            const groupedOrdersObject = filteredOrders.reduce((state: { [key: string]: GroupedOrder }, order: OrderWithDetails) => {
                const date = new Date(order.orderDate).toISOString().slice(0, 10).split("-").reverse().join("/");
                const productKey = `${order.title}-${order.sizeId}-${date}`;
                const currentOrder: GroupedOrder = state[productKey] || { ...order, date, quantity: 0, price: 0, originalPrice: 0, sale: 0 };
                const isOnSale = order.shoppingBasket === 1;
                const pricePaid = isOnSale ? order.price * 0.8 : order.price;
                currentOrder.quantity += order.quantity;
                currentOrder.price += pricePaid * order.quantity;
                currentOrder.originalPrice += order.price * order.quantity;
                currentOrder.sale = isOnSale ? 1 : 0;
                currentOrder.orderId = order.orderId;
                return { ...state, [productKey]: currentOrder };
            }, {});
            return Object.values(groupedOrdersObject);
        },
        enabled: !!loggedInUser?.userData?.userId,
    });

    const totalPrice = useMemo(() => ordersData ? ordersData.reduce((sum, order) => sum + order.price, 0) : 0, [ordersData]);

    const returnOrderMutation = useMutation({
        mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) => dataService.updateStatus2(orderId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
            alert("Status Updated.");
            setEditingOrderId(null);
        }
    });

    const columns = useMemo<ColumnDef<GroupedOrder>[]>(() => [
        { accessorKey: "title", header: "PRODUCT" },
        {
            id: "quantityAndPrice",
            header: "DETAILS",
            cell: (info) => {
                const order = info.row.original;
                return (
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ color: '#888', fontWeight: 900, fontSize: '1.1rem', marginRight: '10px' }}>{order.quantity}x</span>
                        <span style={{ color: '#000', fontWeight: 900, fontSize: '1.1rem' }}>₪{order.price.toFixed(2)}</span>
                    </div>
                );
            }
        },
        { accessorKey: "sizeId", header: "SIZE" },
        { accessorKey: "date", header: "DATE" },
        {
            id: "orderStatus",
            header: "STATUS",
            cell: (info) => {
                const order = info.row.original;
                const statusText = getDisplayStatusText(order.status, order.date);
                let className = "status-shipping";
                if (statusText === "Delivered") className = "status-delivered";
                if (statusText === "Returned") className = "status-returned";
                return <span className={`status-badge ${className}`}>{statusText}</span>;
            }
        },
        {
            id: "actions",
            header: "MANAGE",
            cell: (info) => {
                const order = info.row.original;
                if (editingOrderId === order.orderId) {
                    return (
                        <div style={{ display: "flex", gap: "8px", justifyContent: 'center' }}>
                            <select style={{borderRadius: '8px', border: '1px solid #000'}} onChange={(e) => setCancellationReason(e.target.value)}>
                                <option value="">Reason?</option>
                                <option value="Wrong size">Wrong size</option>
                                <option value="Defective">Defective</option>
                            </select>
                            <button className="cancel-btn" style={{padding: '5px 15px'}} onClick={() => returnOrderMutation.mutate({ orderId: order.orderId, reason: cancellationReason })}>Save</button>
                        </div>
                    );
                }
                return (
                    <button className="cancel-btn" disabled={order.status === 2} onClick={() => setEditingOrderId(order.orderId)}>Cancel</button>
                );
            }
        }
    ], [editingOrderId, cancellationReason, ordersData]);

    const table = useReactTable({ data: ordersData || [], columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="my-orders-container" style={{ padding: "40px 5%", width: "100%", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <style>{styles}</style>
            
            <h1 style={{ fontSize: "4rem", fontWeight: 950, color: "#000", textAlign: "center", marginBottom: "40px", textTransform: "uppercase", letterSpacing: "-3px" }}>
                ORDER HISTORY
            </h1>
            
            <div className="summary-bar" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", background: "#000", padding: "30px", borderRadius: "20px", marginBottom: "40px", color: "#fff", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" }}>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>Orders: <strong>{ordersData?.length || 0}</strong></p>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>Total Price: <span style={{ fontWeight: 800, fontSize: "2.2rem", color: "#f39c12" }}>₪{totalPrice.toLocaleString()}</span></p>
            </div>

            <div className="table-wrapper">
                <table className="orders-table">
                    <thead>
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>
                                {hg.headers.map(h => (
                                    <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={6} style={{textAlign:'center', padding:'50px'}}>LOADING...</td></tr>
                        ) : table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="order-row">
                                {row.getVisibleCells().map(c => (
                                    <td key={c.id}>
                                        {flexRender(c.column.columnDef.cell, c.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}   
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = `
    .table-wrapper {
        background: #fff;
        border-radius: 20px;
        padding: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        border: 2px solid #000; /* מסגרת חיצונית עבה לכל הטבלה */
    }

    .orders-table { 
        width: 100%; 
        border-collapse: collapse; /* מבטל את הרווחים בין התאים ליצירת קווים מאוחדים */
    }

    .orders-table th {
        padding: 20px; 
        color: #000; 
        font-weight: 900; 
        text-transform: uppercase; 
        font-size: 0.9rem; 
        text-align: center;
        border-bottom: 2px solid #000; /* קו תחתון לכותרות */
    }

    .order-row td {
        padding: 20px; 
        font-size: 1.05rem; 
        font-weight: 600; 
        color: #111; 
        text-align: center;
        /* קווים של טבלה אמיתית */
        border: 1px solid #ddd; 
        transition: all 0.2s ease;
    }

    /* אפקט Hover - השורה הופכת בולטת */
    .order-row:hover td {
        background-color: #f8f8f8 !important;
        border-color: #000; /* הקווים הופכים לשחורים ב-Hover */
    }

    .status-badge { padding: 8px 16px; border-radius: 50px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; display: inline-block; }
    .status-delivered { background-color: #000; color: #fff; }
    .status-shipping { background-color: #f39c12; color: #fff; }
    .status-returned { background-color: #eee; color: #888; }
    
    .cancel-btn { background-color: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer; font-weight: 800; transition: 0.3s; }
    .cancel-btn:hover:not(:disabled) { background-color: #333; }
`;