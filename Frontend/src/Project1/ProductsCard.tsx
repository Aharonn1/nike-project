import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import ShoesModel from "../models/ShoesModel";
import SizeModel from "../models/SizeModel";
import EnrichedShoeModel from "../models/EnrichedShoeModel";
import { FaEdit, FaTrashAlt, FaCartPlus, FaUsers, FaCheck, FaTimes } from "react-icons/fa";

interface ProductsCardProps {
    shoes: EnrichedShoeModel[];
    sizes: SizeModel[];
    cartItems: any[];
    totalPrice1: number;
    handleAddToCart1: (shoe: ShoesModel, selectedSize: SizeModel | undefined) => void;
    deleteOrder: (shoeIdObject: { shoesId: number }) => Promise<void>;
}

interface EditedProductValues {
    title?: string;
    description?: string;
    price?: number;
}

function ProductsCard({ shoes, sizes, handleAddToCart1, deleteOrder }: ProductsCardProps) {
    const queryClient = useQueryClient();
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [editedProductValues, setEditedProductValues] = useState<EditedProductValues>({});
    const [hoveredShoeId, setHoveredShoeId] = useState<number | null>(null);

    const updateProductMutation = useMutation<ShoesModel | null, AxiosError, ShoesModel>({
        mutationFn: (updatedProduct: ShoesModel) => dataService.updateProduct(updatedProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shoes"] });
            setEditingProductId(null);
            alert("Product updated! ✅");
        },
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEditedProductValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (shoe: EnrichedShoeModel) => {
        setEditingProductId(shoe.shoesId);
        setEditedProductValues({ title: shoe.title, description: shoe.description, price: shoe.price });
    };

    const handleUpdateProduct = (shoe: EnrichedShoeModel) => {
        const updatedProduct: ShoesModel = {
            ...shoe,
            ...editedProductValues,
            price: editedProductValues.price ? Number(editedProductValues.price) : shoe.price,
        };
        updateProductMutation.mutate(updatedProduct);
    };

    return (
        <div className="admin-products-wrapper">
            <style>{productCardStyles}</style>
            
            <div className="products-grid">
                {shoes.map((shoe) => (
                    <div 
                        key={shoe.shoesId} 
                        className="product-card"
                        onMouseEnter={() => setHoveredShoeId(shoe.shoesId)}
                        onMouseLeave={() => setHoveredShoeId(null)}
                    >
                        {/* 🎯 השכבה השחורה - מכילה עכשיו גם את הכפתורים */}
                        <div className={`buyers-overlay ${hoveredShoeId === shoe.shoesId ? 'active' : ''}`}>
                            <div className="overlay-header">
                                <FaUsers /> <span>CUSTOMER HISTORY</span>
                            </div>
                            
                            <div className="list-wrapper">
                                {shoe.orders && shoe.orders.length > 0 ? (
                                    <ul className="buyers-list">
                                        {shoe.orders.map((order, index) => (
                                            <li key={index} className="buyer-item">
                                                <div className="buyer-name">{order.customerName}</div>
                                                {/* <div className="buyer-qty">{order.total_quantity}x</div> */}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="no-buyers-msg">No orders recorded yet.</div>
                                )}
                            </div>

                            {/* כפתורי פעולה בתוך ה-Overlay כדי שיהיו ניתנים ללחיצה */}
                            <div className="overlay-actions">
                                <button className="act-btn edit" onClick={() => handleEditClick(shoe)}><FaEdit /> Edit</button>
                                <button className="act-btn delete" onClick={() => deleteOrder({ shoesId: shoe.shoesId })}><FaTrashAlt /> Delete</button>
                            </div>
                        </div>

                        <div className="image-holder">
                            <img src={appConfig.shoesImagesUsersUrl + shoe.imageName} alt={shoe.title} />
                        </div>

                        <div className="card-content">
                            {editingProductId === shoe.shoesId ? (
                                <div className="edit-mode-form">
                                    <input name="title" value={editedProductValues.title} onChange={handleInputChange} />
                                    <input name="price" type="number" value={editedProductValues.price} onChange={handleInputChange} />
                                    <div className="edit-btns">
                                        <button className="save-btn" onClick={() => handleUpdateProduct(shoe)}><FaCheck /></button>
                                        <button className="cancel-btn" onClick={() => setEditingProductId(null)}><FaTimes /></button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="product-title">{shoe.title}</h3>
                                    <div className="product-price">₪{shoe.price.toFixed(2)}</div>
                                    <button className="quick-cart-btn" onClick={() => handleAddToCart1(shoe, sizes[0])}>
                                        <FaCartPlus /> ADD TO CART
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const productCardStyles = `
    .admin-products-wrapper { padding: 20px; width: 100%; box-sizing: border-box; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; width: 100%; }

    .product-card {
        background: #fff;
        border-radius: 25px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        transition: 0.4s ease;
        border: 1px solid #f0f0f0;
        height: 450px;
        display: flex;
        flex-direction: column;
    }

    .image-holder { height: 200px; background: #f8f8f8; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .image-holder img { max-width: 100%; max-height: 100%; object-fit: contain; }

    .card-content { padding: 20px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .product-title { font-size: 1rem; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; }
    .product-price { font-size: 1.2rem; font-weight: 900; color: #000; margin-bottom: 10px; }

    .quick-cart-btn { background: #000; color: #fff; border: none; padding: 10px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s; }
    .quick-cart-btn:hover { background: #333; }

    /* 🎯 Overlay Styling */
    .buyers-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.94); color: #fff; z-index: 100;
        padding: 25px; box-sizing: border-box; 
        opacity: 0; visibility: hidden;
        transition: 0.3s ease;
        display: flex; flex-direction: column;
    }
    .buyers-overlay.active { opacity: 1; visibility: visible; }

    .overlay-header { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333; padding-bottom: 12px; margin-bottom: 15px; font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; color: #f39c12; }
    
    .list-wrapper { flex-grow: 1; overflow-y: auto; margin-bottom: 15px; }
    .buyers-list { list-style: none; padding: 0; margin: 0; }
    .buyer-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #222; font-size: 0.8rem; }
    .buyer-name { color: #ccc; }
    .buyer-qty { color: #f39c12; font-weight: 800; }

    /* 🎯 כפתורי ניהול בתוך ה-Overlay */
    .overlay-actions { display: flex; gap: 10px; border-top: 1px solid #333; padding-top: 15px; }
    .act-btn { flex: 1; padding: 10px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
    .act-btn.edit { background: #fff; color: #000; }
    .act-btn.delete { background: #ff4757; color: #fff; }
    .act-btn:hover { transform: scale(1.05); opacity: 0.9; }

    .edit-mode-form { display: flex; flex-direction: column; gap: 8px; z-index: 200; position: relative; }
    .edit-mode-form input { padding: 8px; border-radius: 10px; border: 2px solid #000; font-weight: 700; text-align: center; }
    .edit-btns { display: flex; gap: 10px; justify-content: center; }
    .save-btn { background: #2ecc71; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; }
    .cancel-btn { background: #95a5a6; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; }
`;

export default ProductsCard;