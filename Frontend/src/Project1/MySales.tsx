import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import { Link } from "@tanstack/react-router";
import { AxiosError } from 'axios';
import ShoesModel from "../models/ShoesModel";
import { FaEdit, FaCheck, FaTimes, FaTag } from "react-icons/fa";

interface SaleItem extends ShoesModel {
    discountedPrice: number;
}

interface UpdatePriceData {
    shoesId: number;
    price: number;
}

export default function MySales() {
    const queryClient = useQueryClient();
    const [editingShoeId, setEditingShoeId] = useState<number | null>(null);
    const [newPrice, setNewPrice] = useState<string>("");

    const { data: allShoesData, isLoading, error } = useQuery<ShoesModel[], AxiosError>({
        queryKey: ["allShoes"],
        queryFn: dataService.getAllShoes,
    });

    const updatePriceMutation = useMutation<any, Error, UpdatePriceData>({
        mutationFn: async (updated) => {
            const shoe = allShoesData?.find(s => s.shoesId === updated.shoesId);
            if (!shoe) throw new Error("Not found");
            await dataService.updatePrice({ ...shoe, price: updated.price });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allShoes"] });
            setEditingShoeId(null);
            alert("Price updated!");
        },
    });

    const saleItems = useMemo(() => {
        if (!allShoesData) return [];
        return allShoesData
            .filter(shoe => shoe.shoppingBasket === 1)
            .map(shoe => ({
                ...shoe,
                discountedPrice: shoe.price * 0.8,
            }));
    }, [allShoesData]);

    if (isLoading) return <div className="status-msg">Analyzing Inventory...</div>;
    if (error) return <div className="status-msg error">Error loading data.</div>;

    return (
        <div className="my-sales-wrapper">
            <style>{salesStyles}</style>
            
            <header className="sales-header">
                <div className="header-badge">
                    <FaTag /> <span>FLASH SALES MANAGEMENT</span>
                </div>
                <h1>Active Promotions</h1>
            </header>

            {saleItems.length > 0 ? (
                <div className="sales-grid-container">
                    <div className="sales-grid">
                        {saleItems.map((shoe) => (
                            <div key={shoe.shoesId} className="sale-card">
                                <Link to={"/shoesUsers/" + shoe.shoesId} className="img-container">
                                    <img src={appConfig.shoesImagesUsersUrl + shoe.imageName} alt={shoe.title} />
                                    <div className="sale-tag">-20%</div>
                                </Link>

                                <div className="card-info">
                                    <h3 className="shoe-name">{shoe.title}</h3>
                                    
                                    <div className="price-box">
                                        <span className="old-price">₪{shoe.price.toFixed(2)}</span>
                                        <span className="new-price">₪{shoe.discountedPrice.toFixed(2)}</span>
                                    </div>

                                    {editingShoeId === shoe.shoesId ? (
                                        <div className="edit-actions">
                                            <input
                                                type="number"
                                                value={newPrice}
                                                onChange={(e) => setNewPrice(e.target.value)}
                                                className="price-input"
                                            />
                                            <button onClick={() => updatePriceMutation.mutate({ shoesId: shoe.shoesId, price: parseFloat(newPrice) })} className="btn-save"><FaCheck /></button>
                                            <button onClick={() => setEditingShoeId(null)} className="btn-cancel"><FaTimes /></button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="edit-price-btn" 
                                            onClick={() => { setEditingShoeId(shoe.shoesId); setNewPrice(shoe.price.toString()); }}
                                        >
                                            <FaEdit /> Edit Base Price
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="empty-msg">No items currently on sale.</div>
            )}
        </div>
    );
}

const salesStyles = `
    .my-sales-wrapper {
        padding: 50px 2%;
        background-color: #f9f9f9;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
    }

    .sales-header { text-align: center; margin-bottom: 60px; }
    .header-badge { 
        display: inline-flex; align-items: center; gap: 10px; background: #000; color: #fff; 
        padding: 8px 20px; border-radius: 50px; font-weight: 800; font-size: 0.8rem; margin-bottom: 15px;
    }
    .sales-header h1 { font-size: 3.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; margin: 0; }

    /* 🎯 התיקון למירכוז ופריסה על כל המסך */
    .sales-grid-container {
        display: flex;
        justify-content: center; /* ממרכז את הגריד */
        width: 100%;
    }

    .sales-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 40px;
        width: 100%;
        max-width: 1400px; /* רוחב מקסימלי יוקרתי */
    }

    .sale-card {
        background: #fff;
        border-radius: 25px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        flex-direction: column;
    }
    .sale-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }

    .img-container { position: relative; height: 250px; background: #f5f5f5; display: block; }
    .img-container img { width: 100%; height: 100%; object-fit: contain; padding: 20px; }
    
    .sale-tag {
        position: absolute; top: 15px; left: 15px; background: #ff4757; color: #fff;
        padding: 5px 12px; border-radius: 8px; font-weight: 900; font-size: 0.9rem;
    }

    .card-info { padding: 25px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .shoe-name { font-size: 1.2rem; font-weight: 800; margin-bottom: 15px; color: #111; }
    
    .price-box { margin-bottom: 20px; display: flex; flex-direction: column; gap: 5px; }
    .old-price { text-decoration: line-through; color: #aaa; font-weight: 600; }
    .new-price { color: #ff4757; font-size: 1.5rem; font-weight: 900; }

    .edit-price-btn {
        background: #000; color: #fff; border: none; padding: 12px; border-radius: 12px;
        width: 100%; font-weight: 700; cursor: pointer; transition: 0.3s;
        display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .edit-price-btn:hover { background: #333; }

    .edit-actions { display: flex; gap: 8px; align-items: center; }
    .price-input { width: 100%; padding: 10px; border: 2px solid #000; border-radius: 10px; font-weight: 700; }
    
    .btn-save { background: #2ed573; color: #fff; border: none; padding: 10px; border-radius: 10px; cursor: pointer; }
    .btn-cancel { background: #f1f2f6; color: #2f3542; border: none; padding: 10px; border-radius: 10px; cursor: pointer; }

    .status-msg { text-align: center; padding: 100px; font-weight: 900; font-size: 1.5rem; letter-spacing: 2px; }
`;