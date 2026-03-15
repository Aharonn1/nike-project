import { useMemo } from "react";
import dataService from "../Service/DataService";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import OrderModel from "../models/OrderModel";
import { FaUndoAlt, FaExclamationTriangle, FaLightbulb, FaHistory } from "react-icons/fa";

// --- 1. ממשקים (Interfaces) ---
interface ReturnedOrder extends OrderModel {
    firstName: string;
    lastName: string;
    title: string;
    comment: string;
}

interface ProductReturnAlert {
    shoesId: number;
    title: string;
    totalSales: number;
    returnCount: number;
    returnRate: string;
    topReason: string;
    severity: 'critical' | 'warning';
    action: string;
}

export default function AdminReturnedOrders() {

    // --- 2. שליפת נתונים ---
    const { data: returnedOrders, isLoading: isTableLoading } = useQuery<ReturnedOrder[], AxiosError>({
        queryKey: ["returnedOrders"],
        queryFn: dataService.getAllRepeatOrders as () => Promise<ReturnedOrder[]>,
    });

    const { data: returnAlerts, isLoading: isAlertsLoading } = useQuery<ProductReturnAlert[]>({
        queryKey: ["returnAlerts"],
        queryFn: async () => await dataService.getProductReturnAlerts(),
    });

    // --- 3. הגדרת הטבלה ---
    const columns = useMemo<ColumnDef<ReturnedOrder>[]>(
        () => [
            { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
            { header: "ORDER ID", accessorKey: "orderId", cell: (info) => <span className="id-badge">{String(info.getValue())}</span> },
            { header: "CUSTOMER NAME", accessorFn: (row) => `${row.firstName} ${row.lastName}`, cell: (info) => <b>{String(info.getValue())}</b> },
            { header: "PRODUCT TITLE", accessorKey: "title" },
            { header: "COMMENTS / REASON", accessorKey: "comment", cell: (info) => <span className="reason-text">{String(info.getValue() || "No reason provided")}</span> },
            { header: "DATE", accessorFn: (row) => row.orderDate?.slice(0, 10) },
        ], []
    );

    const table = useReactTable({
        data: returnedOrders || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isTableLoading) return <div className="loading-state">ANALYZING RETURNS...</div>;

    return (
        <div className="returned-orders-wrapper-full">
            <style>{returnedStyles}</style>
            
            <header className="returned-header">
                <div className="header-icon-box"><FaUndoAlt size={30}/></div>
                <h1>RETURNED ORDERS MANAGEMENT</h1>
            </header>

            {/* 🎯 AI Section: Quality Control Alerts */}
            {returnAlerts && returnAlerts.length > 0 && (
                <div className="alerts-container">
                    <h3 className="alerts-title"><FaExclamationTriangle /> Quality Control Alerts (AI Detected)</h3>
                    <div className="alerts-grid">
                        {returnAlerts.map(alert => (
                            <div key={alert.shoesId} className={`alert-card ${alert.severity}`}>
                                <div className="alert-header">
                                    <strong>{alert.title}</strong>
                                    <span className="rate-badge">{alert.returnRate} Returns</span>
                                </div>
                                <p className="reason-summary"><b>Top Reason:</b> "{alert.topReason}"</p>
                                <div className="ai-action-box">
                                    <FaLightbulb className="bulb-icon" />
                                    <div>
                                        <b>AI Action:</b><br/>
                                        {alert.action}
                                    </div>
                                </div>
                                <div className="alert-footer">
                                    <span>Count: {alert.returnCount}</span>
                                    <span>Total Sales: {alert.totalSales}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="summary-banner">
                <FaHistory />
                <span>Total Returned Orders Recorded: <strong>{returnedOrders?.length || 0}</strong></span>
            </div>

            <div className="table-card">
                <table className="returned-premium-table">
                    <thead>
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>{hg.headers.map(h => <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
                        ))}
                    </thead>
                    <tbody>
                        {returnedOrders && returnedOrders.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="table-row-hover">
                                    {row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="empty-msg">No returned orders found. All clear! 🟢</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const returnedStyles = `
    .returned-orders-wrapper-full { padding: 40px 2%; min-height: 100vh; background: #f9f9f9; font-family: 'Inter', sans-serif; }
    
    .returned-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 50px; }
    .header-icon-box { background: #000; color: #fff; padding: 15px; border-radius: 20px; margin-bottom: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .returned-header h1 { font-size: 3rem; font-weight: 950; letter-spacing: -2px; margin: 0; text-transform: uppercase; }

    /* 🎯 AI Alerts Grid */
    .alerts-container { margin-bottom: 40px; background: #fff; padding: 30px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
    .alerts-title { font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; color: #d32f2f; }
    .alerts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    
    .alert-card { padding: 22px; border-radius: 18px; border: 1px solid transparent; transition: 0.3s; }
    .alert-card.critical { background: #fff5f5; border-color: #feb2b2; }
    .alert-card.warning { background: #fffaf0; border-color: #fbd38d; }
    
    .alert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .rate-badge { background: #000; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; }
    
    .reason-summary { font-size: 0.9rem; color: #4a5568; margin-bottom: 15px; }
    .ai-action-box { background: #fff; padding: 12px; border-radius: 10px; border-left: 4px solid #000; font-size: 0.85rem; display: flex; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
    .bulb-icon { color: #f39c12; flex-shrink: 0; margin-top: 3px; }
    
    .alert-footer { display: flex; justify-content: space-between; margin-top: 15px; font-size: 0.75rem; color: #a0aec0; font-weight: 600; }

    /* 🎯 Summary Banner */
    .summary-banner { background: #000; color: #fff; padding: 20px; border-radius: 15px; display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 30px; font-size: 1.1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .summary-banner strong { font-size: 1.5rem; color: #f39c12; }

    /* 🎯 Premium Table */
    .table-card { background: #fff; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.05); width: 100%; }
    .returned-premium-table { width: 100%; border-collapse: collapse; text-align: center; }
    .returned-premium-table th { background: #fafafa; color: #888; padding: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #eee; }
    .returned-premium-table td { padding: 20px; border-bottom: 1px solid #f8f8f8; font-size: 0.95rem; color: #333; transition: 0.3s; }
    
    .table-row-hover:hover { background: #fff !important; transform: scale(1.002); box-shadow: inset 8px 0 0 0 #000, 0 10px 30px rgba(0,0,0,0.05); cursor: pointer; }
    .id-badge { background: #eee; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: #666; }
    .reason-text { font-style: italic; color: #666; font-size: 0.9rem; }

    .loading-state { text-align: center; padding: 100px; font-weight: 900; font-size: 1.5rem; letter-spacing: 3px; color: #ccc; }
    .empty-msg { padding: 50px; font-weight: 700; color: #aaa; }
`;