import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    CellContext,
} from "@tanstack/react-table";
import UserModel from "../models/UserModel";

export interface OrderWithDetails extends UserModel {
    title: string;
    price: number;
    total_quantity: number;
    order_date: string;
}

interface UsersCardProps {
    users: OrderWithDetails[] | undefined;
}

export default function UsersCard({ users }: UsersCardProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const { filteredOrders, totalPrice } = useMemo(() => {
        if (!users) return { filteredOrders: [], totalPrice: 0 };

        const filtered = users.filter((order) => {
            const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
            const productTitle = order.title.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase()) || productTitle.includes(searchTerm.toLowerCase());
        });

        const totalSum = filtered.reduce(
            (sum, order) => sum + (order.price * order.total_quantity),
            0
        );

        return { filteredOrders: filtered, totalPrice: totalSum };
    }, [searchTerm, users]);

    const columns: ColumnDef<OrderWithDetails>[] = useMemo(
        () => [
            {
                header: "CUSTOMER NAME",
                accessorFn: (row) => `${row.firstName} ${row.lastName}`,
                cell: (info) => <span style={{ fontWeight: 800 }}>{String(info.getValue())}</span>
            },
            {
                header: "JOIN DATE",
                accessorFn: (row) => row.registrationDate ? new Date(row.registrationDate).toLocaleDateString("he-IL") : "N/A",
            },
            {
                header: "PRODUCT",
                accessorFn: (row) => row.title || "Unknown",
                cell: (info) => <span style={{ color: "#555", fontWeight: 600 }}>{String(info.getValue())}</span>
            },
            {
                header: "QTY",
                accessorFn: (row) => `${row.total_quantity}x`,
            },
            {
                header: "ORDER DATE",
                accessorFn: (row) => row.order_date ? new Date(row.order_date).toLocaleDateString("he-IL") : "N/A",
            },
            {
                header: "TOTAL PAID",
                cell: (info) => {
                    const rowData = info.row.original;
                    const value = (rowData.price * rowData.total_quantity);
                    return <span style={{ fontWeight: 800, color: "#000" }}>₪{value.toLocaleString()}</span>;
                },
            },
        ],
        [searchTerm, users]
    );

    const table = useReactTable({
        data: filteredOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="admin-container-full" style={{ padding: "40px 2%", width: "100%", boxSizing: "border-box" }}>
            <style>{modernAdminStyles}</style>
            
            <h1 className="admin-main-title">CUSTOMER ORDER OVERVIEW</h1>
            
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by customer or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-bar"
                />
            </div>

            <div className="admin-summary-box">
                <div className="summary-item">
                    <span>Filtered Orders:</span>
                    <strong>{filteredOrders.length}</strong>
                </div>
                <div className="summary-divider" />
                <div className="summary-item">
                    <span>Total Revenue:</span>
                    <strong className="gold-text">₪{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </div>
            </div>

            {filteredOrders.length > 0 ? (
                <div className="admin-table-wrapper">
                    <table className="admin-premium-table">
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <th key={h.id}>
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">No orders match your search criteria.</div>
            )}
        </div>
    );
}

const modernAdminStyles = `
    .admin-main-title {
        font-size: 3.5rem;
        font-weight: 950;
        color: #000;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: -3px;
        margin-bottom: 30px;
    }

    .search-section {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
    }

    .admin-search-bar {
        width: 100%;
        max-width: 600px;
        padding: 15px 25px;
        border-radius: 50px;
        border: 2px solid #eee;
        font-size: 1rem;
        font-family: 'Inter', sans-serif;
        transition: 0.3s;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }

    .admin-search-bar:focus {
        outline: none;
        border-color: #000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .admin-summary-box {
        background: #000;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 50px;
        padding: 30px;
        border-radius: 20px;
        margin-bottom: 40px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }

    .summary-item { display: flex; align-items: center; gap: 15px; font-size: 1.2rem; }
    .summary-item strong { font-size: 2rem; font-weight: 900; }
    .summary-divider { width: 2px; height: 40px; background: rgba(255,255,255,0.1); }
    .gold-text { color: #f39c12; }

    .admin-table-wrapper {
        background: #fff;
        border-radius: 25px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.05);
        width: 100%;
    }

    .admin-premium-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    .admin-premium-table th {
        background: #fafafa;
        color: #888;
        padding: 20px 25px;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1px solid #eee;
    }

    .admin-premium-table td {
        padding: 25px;
        border-bottom: 1px solid #f9f9f9;
        font-size: 1rem;
        color: #111;
        transition: 0.3s;
    }

    .admin-premium-table tbody tr {
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .admin-premium-table tbody tr:hover {
        background-color: #fff !important;
        transform: translateY(-3px) scale(1.002);
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        z-index: 10;
    }

    .admin-premium-table tbody tr:hover td:first-child {
        box-shadow: inset 8px 0 0 0 #000;
    }

    .empty-state {
        text-align: center;
        padding: 100px;
        font-size: 1.5rem;
        color: #ccc;
        font-weight: 700;
    }
`;