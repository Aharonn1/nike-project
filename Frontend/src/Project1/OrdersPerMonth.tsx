import React, { useState, useMemo } from "react";
import dataService from "../Service/DataService";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import OrderModel from "../models/OrderModel";
import { FaChartLine, FaCalendarAlt } from "react-icons/fa";

// ממשקים
interface MonthlyOrder { month_name: string; total_orders: number; }
interface OrderModelWithDetails extends OrderModel { shoeTitle: string; firstName: string; lastName: string; orderDate: string; }
interface AllOrdersResponse { monthlyOrdersData: MonthlyOrder[]; allOrdersFullData: OrderModelWithDetails[]; totalOrdersCount: number; }
interface AggregatedOrder { shoeTitle: string; orderDate: string; firstName: string; lastName: string; quantity: number; }

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthlyOrders = () => {
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedMonthOrders, setSelectedMonthOrders] = useState<AggregatedOrder[]>([]);

    const { data, isLoading } = useQuery<OrderModelWithDetails[], AxiosError, AllOrdersResponse>({
        queryKey: ["monthlyOrdersData"],
        queryFn: () => dataService.getAllOrdersPerMonth(),
        select: (allOrdersResponse) => {
            const { monthlySummaryMap, totalOrdersCount } = allOrdersResponse.reduce(
                (acc, order) => {
                    const monthName = monthNames[new Date(order.orderDate).getMonth()];
                    acc.monthlySummaryMap[monthName] = (acc.monthlySummaryMap[monthName] || 0) + order.quantity;
                    acc.totalOrdersCount += order.quantity;
                    return acc;
                },
                { monthlySummaryMap: {}, totalOrdersCount: 0 } as any
            );
            const monthlyOrdersData = monthNames.map((monthName) => ({
                month_name: monthName,
                total_orders: monthlySummaryMap[monthName] || 0,
            }));
            return { monthlyOrdersData, allOrdersFullData: allOrdersResponse, totalOrdersCount };
        },
    });

    const handleMonthClick = (e: any) => {
        if (e?.activePayload?.length > 0 && data?.allOrdersFullData) {
            const monthName = e.activePayload[0].payload.month_name;
            const monthIndex = monthNames.indexOf(monthName);
            const aggregatedOrdersMap = data.allOrdersFullData.reduce((acc: any, order) => {
                const orderDate = new Date(order.orderDate);
                if (orderDate.getMonth() === monthIndex) {
                    const key = `${order.shoeTitle}-${order.firstName}-${order.lastName}`;
                    if (!acc[key]) {
                        acc[key] = { shoeTitle: order.shoeTitle, orderDate: orderDate.toLocaleDateString("he-IL"), firstName: order.firstName, lastName: order.lastName, quantity: order.quantity };
                    } else { acc[key].quantity += order.quantity; }
                }
                return acc;
            }, {});
            setSelectedMonth(monthName);
            setSelectedMonthOrders(Object.values(aggregatedOrdersMap));
        }
    };

    const columns = useMemo<ColumnDef<AggregatedOrder>[]>(() => [
        { accessorKey: "shoeTitle", header: "PRODUCT" },
        { accessorKey: "orderDate", header: "DATE" },
        { id: "customer", header: "CUSTOMER", accessorFn: (row) => `${row.firstName} ${row.lastName}` },
        { accessorKey: "quantity", header: "QTY" },
    ], []);

    const table = useReactTable({ data: selectedMonthOrders, columns, getCoreRowModel: getCoreRowModel() });

    if (isLoading) return <div className="loading-container">Optimizing View...</div>;

    return (
        <div className="analytics-wrapper">
            <style>{chartStyles}</style>
            
            <header className="analytics-header">
                <div className="header-icon"><FaChartLine size={30} /></div>
                <h1>Monthly Sales Intelligence</h1>
                <div className="annual-stat">
                    Total Volume: <span>{data?.totalOrdersCount} Orders</span>
                </div>
            </header>

            <div className="main-grid-wide">
                <div className="chart-card-widescreen">
                    <div className="card-top">
                        <h3><FaCalendarAlt /> Distribution per Month</h3>
                        <p>Performance trends - Click for details</p>
                    </div>
                    {/* 🎯 התיקון: רוחב מקסימלי אבל גובה קומפקטי למניעת גלילה */}
                    <div className="chart-container-compact">
                        <ResponsiveContainer width="100%" height={450}>
                            <ComposedChart data={data?.monthlyOrdersData} onClick={handleMonthClick} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month_name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 13, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '15px' }}
                                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                />
                                <Area type="monotone" dataKey="total_orders" stroke="none" fillOpacity={1} fill="url(#colorOrders)" />
                                <Bar dataKey="total_orders" fill="#000" barSize={35} radius={[8, 8, 0, 0]} />
                                <Line type="monotone" dataKey="total_orders" stroke="#f39c12" strokeWidth={4} dot={{ r: 5, fill: '#f39c12', strokeWidth: 2, stroke: '#fff' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {selectedMonth && (
                    <div className="details-card-wide fade-in">
                        <div className="card-top">
                            <h3>Breakout: {selectedMonth}</h3>
                            <button className="close-btn" onClick={() => setSelectedMonth(null)}>×</button>
                        </div>
                        <div className="table-wrapper">
                            <table className="orders-premium-table">
                                <thead>
                                    {table.getHeaderGroups().map(hg => (
                                        <tr key={hg.id}>{hg.headers.map(h => <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>{row.getVisibleCells().map(c => <td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</td>)}</tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const chartStyles = `
    .analytics-wrapper { padding: 20px 1%; background: #fcfcfc; min-height: 100vh; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    .analytics-header { text-align: center; margin-bottom: 25px; }
    .header-icon { background: #000; color: #fff; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 15px; margin: 0 auto 15px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
    .analytics-header h1 { font-size: 2.5rem; font-weight: 950; letter-spacing: -2px; text-transform: uppercase; margin: 0; }
    .annual-stat { margin-top: 10px; font-size: 1.1rem; color: #555; }
    .annual-stat span { background: #000; color: #fff; padding: 4px 15px; border-radius: 50px; font-weight: 800; margin-left: 8px; }

    .main-grid-wide { display: flex; flex-direction: column; gap: 25px; align-items: center; width: 100%; }
    
    .chart-card-widescreen { 
        background: #fff; 
        width: 98%; 
        max-width: 1700px; 
        border-radius: 30px; 
        padding: 30px; 
        box-shadow: 0 20px 50px rgba(0,0,0,0.05); 
        border: 1px solid #f2f2f2;
    }
    
    .card-top { margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8f8f8; padding-bottom: 15px; }
    .card-top h3 { font-size: 1.2rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
    .card-top p { color: #aaa; font-size: 0.9rem; }

    .details-card-wide { 
        background: #fff; 
        width: 98%; 
        max-width: 1700px; 
        border-radius: 30px; 
        padding: 25px; 
        box-shadow: 0 15px 40px rgba(0,0,0,0.08); 
        border-left: 10px solid #f39c12; 
    }

    .orders-premium-table { width: 100%; border-collapse: collapse; }
    .orders-premium-table th { color: #888; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; padding: 15px; text-align: left; background: #fafafa; }
    .orders-premium-table td { padding: 15px; font-size: 1rem; font-weight: 700; color: #111; border-bottom: 1px solid #f0f0f0; }

    .loading-container { text-align: center; padding: 100px; font-weight: 900; font-size: 1.5rem; letter-spacing: 5px; color: #eee; }
    .close-btn { background: #f5f5f5; border: none; width: 35px; height: 35px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; }
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
`;

export default MonthlyOrders;