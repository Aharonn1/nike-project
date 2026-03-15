import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dataService from "../Service/DataService";
import { Link } from "@tanstack/react-router";
import appConfig from "../Utils/AppConfig";
import React, { useMemo } from "react";
import { AxiosError } from "axios";
import { FaTrashAlt, FaHeart, FaShoppingBag } from "react-icons/fa";

// --- Interfaces ---
interface AuthUser {
    userData: { userId: number; };
}

interface FavoriteWithDetails {
    shoesId: number;
    title: string;
    price: number;
    categoryName: string;
    description: string;
    stock: number;
    bought: number;
    global_total_favorites: number;
    imageName: string;
}

interface FavoriteModel {
    shoesId: number;
    userId: number;
}

function MyFavorites() {
    const queryClient = useQueryClient();

    const loggedInUser: AuthUser | null = useMemo(() => {
        const userString = localStorage.getItem("user");
        return userString ? JSON.parse(userString) : null;
    }, []);

    const userId = loggedInUser?.userData?.userId;

    const { data: favorites, isLoading, isError } = useQuery<FavoriteModel[], AxiosError, FavoriteWithDetails[]>({
        queryKey: ['favorites', userId],
        queryFn: () => dataService.getAllFavoritesByUser(userId!),
        enabled: !!userId,
        select: (data) => data.map(item => ({
            ...item,
            title: (item as any).title || "Premium Sneaker",
            price: (item as any).price || 0,
            categoryName: (item as any).categoryName || "Shoes",
            description: (item as any).description || "",
            stock: (item as any).stock || 0,
            bought: (item as any).bought || 0,
            global_total_favorites: (item as any).global_total_favorites || 0,
            imageName: (item as any).imageName || "default.jpg",
        }))
    });

    const removeFavoriteMutation = useMutation<void, AxiosError, number>({
        mutationFn: (shoesId: number) => dataService.removeFavorite(userId!, shoesId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        },
    });

    if (isLoading) return <div style={msgStyle}>Curating your collection... 🎨</div>;
    if (isError) return <div style={msgStyle}>Error loading your favorites.</div>;

    return (
        <div style={pageContainerStyle}>
            <style>{hoverStyles}</style>
            <div style={headerSectionStyle}>
                <h1 style={pageTitleStyle}>MY WISHLIST <FaHeart style={{color: '#ff4d4d', fontSize: '28px'}}/></h1>
                <p style={pageSubtitleStyle}>{favorites?.length || 0} items you truly love</p>
            </div>

            <div style={gridStyle}>
                {favorites && favorites.length > 0 ? (
                    favorites.map((favorite) => (
                        <div key={favorite.shoesId} className="fav-card" style={cardStyle}>
                            {/* כפתור הסרה מהיר בפינה */}
                            <button 
                                style={removeIconBtnStyle} 
                                onClick={() => removeFavoriteMutation.mutate(favorite.shoesId)}
                                title="Remove from favorites"
                            >
                                <FaTrashAlt />
                            </button>

                            <Link
                                to="/user/shoesUsers/$shoesId"
                                params={{ shoesId: favorite.shoesId.toString() }}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={imageWrapperStyle}>
                                    <img 
                                        src={appConfig.shoesImagesUsersUrl + favorite.imageName} 
                                        alt={favorite.title}
                                        style={imgStyle}
                                    />
                                </div>

                                <div style={infoContentStyle}>
                                    <span style={catTagStyle}>{favorite.categoryName}</span>
                                    <h3 style={itemTitleStyle}>{favorite.title}</h3>
                                    <div style={priceRowStyle}>
                                        <span style={priceTextStyle}>₪{favorite.price.toFixed(2)}</span>
                                        <span style={likesCountStyle}>⭐ {favorite.global_total_favorites}</span>
                                    </div>
                                    
                                    <div style={statsRowStyle}>
                                        <span>🔥 {favorite.bought} bought</span>
                                        <span style={{color: favorite.stock > 0 ? '#2ecc71' : '#e74c3c'}}>
                                            {favorite.stock > 0 ? `In Stock (${favorite.stock})` : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to="/user/shoesUsers/$shoesId"
                                params={{ shoesId: favorite.shoesId.toString() }}
                                style={actionBtnStyle}
                            >
                                <FaShoppingBag style={{marginRight: '8px'}}/> VIEW PRODUCT
                            </Link>
                        </div>
                    ))
                ) : (
                    <div style={emptyStateStyle}>
                        <h2 style={{color: '#aaa'}}>Your wishlist is empty.</h2>
                        <Link to="/user/shoesUsers" style={shopLinkStyle}>START SHOPPING</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

/* --- Premium Styles --- */

const hoverStyles = `
    .fav-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .fav-card:hover { transform: translateY(-12px); boxShadow: 0 25px 50px rgba(0,0,0,0.1); }
`;

const pageContainerStyle: React.CSSProperties = {
    padding: "60px 4%",
    width: "80%",
    maxWidth: "95%",
    margin: "0 auto",
    minHeight: "80vh",
    fontFamily: "'Inter', sans-serif",
};

const headerSectionStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "50px"
};

const pageTitleStyle: React.CSSProperties = {
    fontSize: "3rem",
    fontWeight: "900",
    letterSpacing: "-2px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px"
};

const pageSubtitleStyle: React.CSSProperties = {
    color: "#888",
    fontSize: "1.1rem",
    marginTop: "10px"
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "35px",
};

const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "24px",
    padding: "20px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    overflow: "hidden"
};

const removeIconBtnStyle: React.CSSProperties = {
    position: "absolute",
    top: "15px",
    right: "15px",
    zIndex: 10,
    background: "rgba(255, 255, 255, 0.9)",
    border: "none",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#e74c3c",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const imageWrapperStyle: React.CSSProperties = {
    width: "100%",
    height: "240px",
    backgroundColor: "#f6f6f6",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    overflow: "hidden"
};

const imgStyle: React.CSSProperties = {
    width: "85%",
    height: "auto",
    objectFit: "contain",
    transition: "transform 0.5s ease"
};

const infoContentStyle: React.CSSProperties = {
    padding: "0 5px"
};

const catTagStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "800",
    color: "#ff4d4d",
    textTransform: "uppercase"
};

const itemTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "900",
    margin: "5px 0 15px 0",
    color: "#111"
};

const priceRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
};

const priceTextStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "800",
    color: "#000"
};

const likesCountStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#666",
    fontWeight: "600"
};

const statsRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#888",
    fontWeight: "600",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "12px"
};

const actionBtnStyle: React.CSSProperties = {
    marginTop: "20px",
    backgroundColor: "#111",
    color: "#fff",
    textAlign: "center",
    padding: "15px",
    borderRadius: "15px",
    fontWeight: "800",
    textDecoration: "none",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s"
};

const msgStyle: React.CSSProperties = { textAlign: 'center', padding: '100px', fontSize: '20px', fontWeight: '800' };
const emptyStateStyle: React.CSSProperties = { gridColumn: "1 / -1", textAlign: "center", padding: "100px 0" };
const shopLinkStyle: React.CSSProperties = { color: "#000", fontWeight: "900", textDecoration: "underline", marginTop: "20px", display: "inline-block" };

export default MyFavorites;