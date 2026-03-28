import React, { useState, useMemo, useRef, useEffect } from "react";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import { FaPlay, FaHeart, FaRegHeart, FaPlus, FaMinus, FaPaperPlane } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderModel from "../models/OrderModel";
import shoesSizeModel from "../models/shoesSizeModel";
import { useLoaderData, useParams } from "@tanstack/react-router";
import CommentModel, { CommentModelWithUser } from "../models/CommentModel";
import { oneProductsCardRoute } from '../router';
import FavoriteModel from "../models/FavoriteModel";

function OneProductsCard() {
    const queryClient = useQueryClient();
    const loggedInUser = JSON.parse(localStorage.getItem("user") || '{}');
    const loggedInUserId = loggedInUser?.userData?.userId;
    const updateStock = loggedInUser?.userData?.updateStock;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showVideo, setShowVideo] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>(""); // State לתגובה החדשה
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);

    const { shoesId } = useParams({ from: oneProductsCardRoute.id });
    const shoesIdNumber = +shoesId;
    const shoeData: any = useLoaderData({ from: oneProductsCardRoute.id });

    useEffect(() => {
        if (showVideo && videoRef.current) {
            videoRef.current.play().catch(err => console.error("Autoplay failed:", err));
        }
    }, [showVideo]);

    // Queries
    const { data: stockData, isLoading: isStockLoading } = useQuery<shoesSizeModel[]>({
        queryKey: ["shoesSizes", shoesIdNumber],
        queryFn: () => dataService.getAllShoesSizes(shoesIdNumber)
    });

    const { data: allOrdersData, isLoading: isOrdersLoading } = useQuery<OrderModel[]>({
        queryKey: ["allOrdersForUser", loggedInUserId],
        queryFn: () => dataService.getAllOrders3(loggedInUserId as number),
        enabled: !!loggedInUserId,
    });

    const { data: comments, isLoading: isCommentsLoading } = useQuery<CommentModel[], Error, CommentModelWithUser[]>({
        queryKey: ["comments", shoesIdNumber],
        queryFn: () => dataService.getAllComments(shoesIdNumber)
    });

    const { data: favorites, isLoading: isFavoritesLoading } = useQuery<FavoriteModel[]>({
        queryKey: ["favorites", loggedInUserId],
        queryFn: () => dataService.getAllFavoritesByUser(loggedInUserId as number),
        enabled: !!loggedInUserId,
    });

    // Mutations
    const addCommentMutation = useMutation({
        mutationFn: (comment: CommentModel) => dataService.addComment(comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", shoesIdNumber] });
            setNewComment(""); // איפוס התיבה לאחר שליחה
        }
    });

    const handleLikeMutation = useMutation({
        mutationFn: () => isLiked ? dataService.removeFavorite(loggedInUserId!, shoesIdNumber) : dataService.addFavorite(loggedInUserId!, shoesIdNumber),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", loggedInUserId] })
    });

    const addOrderMutation = useMutation({
        mutationFn: (vars: any) => dataService.handleOrder1(vars.userId, vars.shoesId, vars.quantity, vars.sizeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allOrdersForUser", loggedInUserId] });
            queryClient.invalidateQueries({ queryKey: ["shoesSizes", shoesIdNumber] });
        }
    });

    const deleteOrderMutation = useMutation({
        mutationFn: (vars: any) => updateStock === 1 ? dataService.deleteOrder(vars.orderId) : dataService.deleteOrder1(vars.orderId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allOrdersForUser", loggedInUserId] })
    });

    // Logic
    const userOrdersForThisShoe = useMemo(() => {
        if (!allOrdersData) return [];
        return allOrdersData.filter(o => o.shoesId === shoesIdNumber && (o.status === 0 || o.status === 3));
    }, [allOrdersData, shoesIdNumber]);

    const isLiked = useMemo(() => favorites?.some(f => Number(f.shoesId) === shoesIdNumber), [favorites, shoesIdNumber]);

    const handleAddComment = () => {
    if (!newComment.trim()) return;

    // אנחנו יוצרים אובייקט חלקי ושולחים אותו לשרת
    // השרת כבר יוסיף לו ID ותאריך באופן אוטומטי
    const comment = {
        shoesId: shoesIdNumber,
        userId: loggedInUserId,
        commentText: newComment,
    } as CommentModel; 

    addCommentMutation.mutate(comment);
};

    const handleAddToCart = () => {
        if (!selectedSizeId) return alert("Please select a size");
        const sizeStock = stockData?.find(s => s.sizeId === selectedSizeId)?.stock || 0;
        const inCart = userOrdersForThisShoe.filter(o => o.sizeId === selectedSizeId).length;
        if (inCart >= sizeStock) return alert("Out of stock");
        addOrderMutation.mutate({ userId: loggedInUserId!, shoesId: shoeData.shoesId, quantity: 1, sizeId: selectedSizeId });
    };

    const handleRemoveFromCart = () => {
        const order = userOrdersForThisShoe.find(o => o.sizeId === selectedSizeId);
        if (order) deleteOrderMutation.mutate({ orderId: order.orderId });
    };

    if (isStockLoading || isOrdersLoading || isCommentsLoading || isFavoritesLoading) return <div>Loading...</div>;

    return (
        <div style={pageWrapperStyle}>
            <div style={productContainerStyle}>
                
                {/* Gallery Section */}
                <div style={gallerySectionStyle}>
                    <div style={thumbnailColumnStyle}>
                        <div style={thumbStyle} onMouseEnter={() => setShowVideo(true)} onMouseLeave={() => setShowVideo(false)}>
                            <FaPlay size={14} />
                        </div>
                        {[shoeData.imageName, shoeData.imageNameFront, shoeData.imageNameAbove, shoeData.imageNameBack, shoeData.imageNameDown]
                            .filter(Boolean).map((img, i) => (
                            <img key={i} src={appConfig.shoesImagesUsersUrl + img} style={thumbImgStyle} 
                                 onMouseEnter={() => { setSelectedImage(img!); setShowVideo(false); }} />
                        ))}
                    </div>
                    <div style={mainDisplayStyle}>
                        {showVideo ? (
                            <video ref={videoRef} muted playsInline loop crossOrigin="anonymous" style={videoStyle}>
                                <source src={appConfig.shoesImagesUsersUrl + shoeData.video} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={appConfig.shoesImagesUsersUrl + (selectedImage || shoeData.imageName)} style={mainImgStyle} />
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div style={infoSectionStyle}>
                    <div style={headerRowStyle}>
                        <span style={categoryTextStyle}>{shoeData.categoryName}</span>
                        <div onClick={() => handleLikeMutation.mutate()} style={likeButtonStyle}>
                            {isLiked ? <FaHeart color="#ff4d4d" size={26} /> : <FaRegHeart size={26} />}
                        </div>
                    </div>
                    
                    <h1 style={titleStyle}>{shoeData.title}</h1>
                    
                    <div style={priceContainerStyle}>
                        <span style={salePriceStyle}>
                            ₪{shoeData.shoppingBasket === 1 ? (shoeData.price * 0.8).toFixed(2) : shoeData.price.toFixed(2)}
                        </span>
                    </div>

                    <p style={descriptionStyle}>{shoeData.description}</p>

                    <div style={sectionLabelStyle}>SELECT SIZE</div>
                    <div style={sizeGridStyle}>
                        {stockData?.map((size) => (
                            <button key={size.sizeId} disabled={size.stock === 0}
                                onClick={() => setSelectedSizeId(size.sizeId)}
                                style={{
                                    ...sizeButtonStyle,
                                    border: selectedSizeId === size.sizeId ? "2px solid #000" : "1px solid #e5e5e5",
                                    backgroundColor: size.stock === 0 ? "#f9f9f9" : "#fff",
                                }}>
                                {size.sizeId}
                            </button>
                        ))}
                    </div>

                    <div style={actionRowStyle}>
                        <div style={qtyControlStyle}>
                            <button style={qtyBtnStyle} onClick={handleRemoveFromCart}><FaMinus size={12}/></button>
                            <span style={qtyValueStyle}>{userOrdersForThisShoe.length}</span>
                            <button style={qtyBtnStyle} onClick={handleAddToCart}><FaPlus size={12}/></button>
                        </div>
                        <button style={addToBagButtonStyle} onClick={handleAddToCart}>Add to Bag</button>
                    </div>

                    <div style={statsStyle}>
                        <span>🔥 {shoeData.bought} purchased</span>
                        <span>⭐ {shoeData.total_favorites || 0} Favorites</span>
                    </div>

                    {/* Comments Section */}
                    <div style={commentsSectionStyle}>
                        <h3 style={sectionLabelStyle}>REVIEWS ({comments?.length || 0})</h3>
                        
                        {/* תוספת: תיבת הוספת תגובה */}
                        {loggedInUserId && (
                            <div style={addCommentBoxStyle}>
                                <input 
                                    style={commentInputStyle} 
                                    placeholder="Add a review..." 
                                    value={newComment} 
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button style={sendCommentButtonStyle} onClick={handleAddComment}>
                                    <FaPaperPlane size={14} color="#fff" />
                                </button>
                            </div>
                        )}

                        <div style={commentsListStyle}>
                            {comments?.map(c => (
                                <div key={c.commentId} style={commentCardStyle}>
                                    <div style={{ fontWeight: "800", fontSize: "14px" }}>{c.firstName} {c.lastName}</div>
                                    <p style={{ margin: "5px 0", color: "#333", fontSize: "14px" }}>{c.commentText}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --- Styles --- */
const pageWrapperStyle: React.CSSProperties = { padding: "40px 20px", backgroundColor: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const productContainerStyle: React.CSSProperties = { display: "flex", gap: "60px", maxWidth: "1300px", margin: "0 auto" };
const gallerySectionStyle: React.CSSProperties = { display: "flex", gap: "15px", flex: "1.6" };
const thumbnailColumnStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px", width: "70px" };
const thumbStyle: React.CSSProperties = { width: "70px", height: "70px", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "8px" };
const thumbImgStyle: React.CSSProperties = { width: "70px", height: "70px", objectFit: "cover", cursor: "pointer", borderRadius: "8px" };
const mainDisplayStyle: React.CSSProperties = { flex: 1, backgroundColor: "#f6f6f6", borderRadius: "20px", overflow: "hidden", height: "650px" };
const mainImgStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "contain" };
const videoStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
const infoSectionStyle: React.CSSProperties = { flex: 1, display: "flex", flexDirection: "column", gap: "15px" };
const headerRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const categoryTextStyle: React.CSSProperties = { fontSize: "16px", fontWeight: "600", color: "#d93921" };
const likeButtonStyle: React.CSSProperties = { cursor: "pointer" };
const titleStyle: React.CSSProperties = { fontSize: "42px", fontWeight: "900", letterSpacing: "-1.5px" };
const priceContainerStyle: React.CSSProperties = { margin: "10px 0" };
const salePriceStyle: React.CSSProperties = { fontSize: "28px", fontWeight: "800" };
const descriptionStyle: React.CSSProperties = { color: "#555", lineHeight: "1.6", fontSize: "16px" };
const sectionLabelStyle: React.CSSProperties = { fontWeight: "800", fontSize: "16px", marginTop: "15px" };
const sizeGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" };
const sizeButtonStyle: React.CSSProperties = { padding: "14px", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer" };
const actionRowStyle: React.CSSProperties = { display: "flex", gap: "15px", marginTop: "25px" };
const qtyControlStyle: React.CSSProperties = { display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "40px", padding: "5px 20px" };
const qtyBtnStyle: React.CSSProperties = { border: "none", background: "none", cursor: "pointer", padding: "10px" };
const qtyValueStyle: React.CSSProperties = { width: "30px", textAlign: "center", fontWeight: "800", fontSize: "18px" };
const addToBagButtonStyle: React.CSSProperties = { flex: 1, backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "40px", fontSize: "16px", fontWeight: "800", cursor: "pointer" };
const statsStyle: React.CSSProperties = { display: "flex", gap: "30px", fontSize: "14px", color: "#777", borderBottom: "1px solid #eee", paddingBottom: "20px" };
const commentsSectionStyle: React.CSSProperties = { marginTop: "20px" };
const commentsListStyle: React.CSSProperties = { maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" };
const commentCardStyle: React.CSSProperties = { padding: "15px", backgroundColor: "#f8f8f8", borderRadius: "12px", border: "1px solid #eee" };

// סטייל חדש לתיבת התגובה
const addCommentBoxStyle: React.CSSProperties = { display: "flex", gap: "10px", marginTop: "10px" };
const commentInputStyle: React.CSSProperties = { flex: 1, padding: "12px 20px", borderRadius: "40px", border: "1px solid #ddd", fontSize: "14px", outline: "none" };
const sendCommentButtonStyle: React.CSSProperties = { backgroundColor: "#000", border: "none", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

export default OneProductsCard;