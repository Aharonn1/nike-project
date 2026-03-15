import React, { useState, useMemo } from "react";
import dataService from "../Service/DataService";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    CellContext,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import OrderModel from "../models/OrderModel";
import { FaUserEdit, FaStar, FaQuoteLeft, FaUsers } from "react-icons/fa";

interface OrderWithReviews extends OrderModel {
    firstName: string;
    lastName: string;
    title: string;
    userCommentExperience: string;
    userExperience: number;
    userId: number;
}

interface ProcessedData {
    displayedOrders: OrderWithReviews[];
    uniqueUsers: OrderWithReviews[];
    averageRating: string | "N/A";
    ratedOrdersCount: number;
}

export default function AdminUsersExperience() {
    const [showUserSelect, setShowUserSelect] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<string>("all");

    const { data: allOrders, isLoading, error } = useQuery<OrderWithReviews[], AxiosError>({
        queryKey: ["allOrdersWithCommentsAndRatings"],
        queryFn: dataService.getAllOrders2 as () => Promise<OrderWithReviews[]>,
    });

    const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserId(e.target.value);
    };

    const toggleUserSelect = () => {
        setShowUserSelect(!showUserSelect);
        if (showUserSelect) setSelectedUserId("all");
    };

    const processedData = useMemo<ProcessedData>(() => {
        if (!allOrders) return { displayedOrders: [], uniqueUsers: [], averageRating: "N/A", ratedOrdersCount: 0 };

        const filteredOrders = allOrders.filter(
            (order) => (order.userCommentExperience && order.userCommentExperience.trim() !== "") || order.userExperience > 0
        );

        const uniqueUserIds = new Set(filteredOrders.map((order) => order.userId));
        const uniqueUsers = Array.from(uniqueUserIds).map((userId) =>
            filteredOrders.find((order) => order.userId === userId) as OrderWithReviews
        );

        const displayedOrders = selectedUserId === "all"
            ? filteredOrders
            : filteredOrders.filter((order) => order.userId === parseInt(selectedUserId));

        const ratings = displayedOrders.map((order) => order.userExperience).filter((r) => r > 0);
        const averageRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";

        return { displayedOrders, uniqueUsers, averageRating, ratedOrdersCount: ratings.length };
    }, [allOrders, selectedUserId]);

    const columns = useMemo<ColumnDef<OrderWithReviews>[]>(() => [
        { header: "#", accessorKey: "id", cell: (info) => info.row.index + 1 },
        { header: "USER ID", accessorKey: "userId", cell: (info) => <span className="id-badge">{String(info.getValue())}</span> },
        { header: "CUSTOMER", accessorFn: (row) => `${row.firstName} ${row.lastName}`, cell: (info) => <b>{String(info.getValue())}</b> },
        { header: "PRODUCT", accessorKey: "title" },
        { 
            header: "COMMENT", 
            accessorKey: "userCommentExperience", 
            cell: (info) => (
                <div className="comment-cell">
                    <FaQuoteLeft className="quote-icon" />
                    <span>{String(info.getValue() || "No comment")}</span>
                </div>
            ) 
        },
        { 
            header: "RATING", 
            accessorKey: "userExperience", 
            cell: (info) => (
                <div className="rating-badge">
                    <FaStar className="star-icon" />
                    <span>{Number(info.getValue())}/5</span>
                </div>
            ) 
        },
    ], []);

    const table = useReactTable({
        data: processedData.displayedOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <div className="loading-state">LOADING FEEDBACK...</div>;

    return (
        <div className="reviews-wrapper-full">
            <style>{reviewsStyles}</style>
            
            <header className="reviews-header">
                <div className="header-icon-box"><FaUserEdit size={30}/></div>
                <h1>USER EXPERIENCE & REVIEWS</h1>
            </header>

            <div className="stats-container-premium">
                <div className="stat-card black" onClick={toggleUserSelect} style={{ cursor: 'pointer' }}>
                    <div className="stat-info">
                        <p>Average Rating</p>
                        <h3><FaStar style={{color: '#f39c12'}} /> {processedData.averageRating}</h3>
                    </div>
                    {showUserSelect && (
                        <select className="user-dropdown" onClick={(e) => e.stopPropagation()} onChange={handleUserSelect} defaultValue="all">
                            <option value="all">All Customers</option>
                            {processedData.uniqueUsers.map((user) => (
                                <option key={user.userId} value={user.userId}>{user.firstName} {user.lastName}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="stat-card white">
                    <div className="stat-info">
                        <p>Total Reviews</p>
                        <h3><FaUsers /> {processedData.ratedOrdersCount}</h3>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <table className="reviews-premium-table">
                    <thead>
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>{hg.headers.map(h => <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="table-row-hover">
                                    {row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="empty-msg">No reviews found for this selection.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const reviewsStyles = `
    .reviews-wrapper-full { padding: 40px 2%; min-height: 100vh; background: #fcfcfc; font-family: 'Inter', sans-serif; }
    
    .reviews-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }
    .header-icon-box { background: #000; color: #fff; padding: 15px; border-radius: 20px; margin-bottom: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .reviews-header h1 { font-size: 2.8rem; font-weight: 950; letter-spacing: -2px; margin: 0; text-transform: uppercase; }

    /* 🎯 Stats Cards */
    .stats-container-premium { display: flex; justify-content: center; gap: 30px; margin-bottom: 50px; }
    .stat-card { padding: 30px 50px; border-radius: 25px; min-width: 250px; text-align: center; transition: 0.3s; position: relative; }
    .stat-card.black { background: #000; color: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.15); }
    .stat-card.white { background: #fff; color: #000; box-shadow: 0 15px 40px rgba(0,0,0,0.05); border: 1px solid #eee; }
    
    .stat-info p { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; opacity: 0.7; }
    .stat-info h3 { font-size: 2.5rem; font-weight: 900; margin: 0; display: flex; align-items: center; justify-content: center; gap: 10px; }

    .user-dropdown { margin-top: 15px; padding: 8px; border-radius: 10px; border: none; width: 100%; font-weight: 700; background: #222; color: #fff; }

    /* 🎯 Table Styling */
    .table-card { background: #fff; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.05); width: 100%; }
    .reviews-premium-table { width: 100%; border-collapse: collapse; text-align: left; }
    .reviews-premium-table th { background: #fafafa; color: #888; padding: 22px 25px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #eee; }
    .reviews-premium-table td { padding: 22px 25px; border-bottom: 1px solid #f8f8f8; font-size: 1rem; color: #333; transition: 0.3s; }
    
    .table-row-hover:hover { background: #fff !important; transform: scale(1.002); box-shadow: inset 8px 0 0 0 #000, 0 10px 30px rgba(0,0,0,0.05); cursor: pointer; }

    .id-badge { background: #eee; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: #666; }
    
    .comment-cell { display: flex; align-items: center; gap: 10px; color: #555; font-style: italic; }
    .quote-icon { color: #ddd; font-size: 0.8rem; }
    
    .rating-badge { display: inline-flex; align-items: center; gap: 5px; background: #fff9e6; color: #d4a017; padding: 5px 12px; border-radius: 50px; font-weight: 800; font-size: 0.9rem; border: 1px solid #ffecb3; }
    .star-icon { font-size: 0.8rem; }

    .loading-state { text-align: center; padding: 100px; font-weight: 900; font-size: 1.5rem; letter-spacing: 3px; color: #ccc; }
    .empty-msg { padding: 50px; text-align: center; color: #aaa; font-weight: 700; }
`;