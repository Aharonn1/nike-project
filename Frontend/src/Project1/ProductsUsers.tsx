import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import appConfig from "../Utils/AppConfig";
import dataService from "../Service/DataService";
import ProductUserCard from "./ProductsUserCard";
import { ProductAiChat } from "./ProductAiChat";
import OrderModel from "../models/OrderModel";

// --- Interfaces ---
export interface Shoe { shoesId: number; title: string; description?: string; imageName: string; price: number; color?: string; availableSizes?: string; categoryId: number; shoppingBasket?: number }
export interface Category { categoryId: number; categoryName: string; }
export interface ShoeSize { shoeSizeId: number; shoesId: number; sizeId: number; stock: number; }
export interface AuthUser { userData: { userId: number; firstName: string; lastName: string; username: string; token: string; userType: string; updateStock: number; }; userId: number; }
export interface SaleShoesLookup { [shoesId: number]: boolean; }
export interface OutOfStockLookup { [shoesId: number]: boolean; }
export interface ConsolidatedCartItem { shoesId: number; sizeId: number; quantity: number; title: string; price: number; imageName: string; orderId: number; }

function ProductsUsers() {
    const queryClient = useQueryClient();
    const routerState = useRouterState();

    // --- States ---
    const [selectedColor, setSelectedColor] = useState<string>("all");
    const [selectedSize, setSelectedSize] = useState<string | number>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
    const [text, setText] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [showCart, setShowCart] = useState<boolean>(false);
    const [showSaleSuggestions, setShowSaleSuggestions] = useState<boolean>(false);

    const loggedInUser: AuthUser | null = JSON.parse(localStorage.getItem("user") || "null");
    const loggedInUserId = loggedInUser?.userData?.userId;
    const isProductsListPage = routerState.location.pathname === "/user/shoesUsers";

    // --- Styles ---
    const mainControlsWrapperStyle: React.CSSProperties = { maxWidth: "1000px", margin: "40px auto", padding: "35px", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(15px)", borderRadius: "35px", boxShadow: "0 20px 50px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "25px", border: "1px solid rgba(255,255,255,0.4)", alignItems: "center" };
    const filtersRowStyle: React.CSSProperties = { display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", width: "100%" };
    const selectContainerStyle: React.CSSProperties = { position: "relative", flex: "1", minWidth: "120px", maxWidth: "200px" };
    const minimalSelectStyle: React.CSSProperties = { width: "100%", padding: "12px 20px", borderRadius: "15px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" };
    
    // ✅ הרחקת הכפתורים: הגדלתי את ה-gap ל-30px
    const searchRowStyle: React.CSSProperties = { display: "flex", gap: "40px", alignItems: "center", justifyContent: "center", width: "100%" };
    const searchInputWrapperStyle: React.CSSProperties = { position: "relative", width: "350px" }; 
    const minimalInputStyle: React.CSSProperties = { width: "100%", padding: "14px 20px", borderRadius: "15px", border: "1px solid rgba(0,0,0,0.05)", backgroundColor: "#fff", fontSize: "15px", outline: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" };
    
    const clearButtonStyle: React.CSSProperties = { padding: "12px 20px", borderRadius: "12px", border: "1px solid #ddd", backgroundColor: "transparent", fontWeight: "700", cursor: "pointer" };
    const saleButtonStyle: React.CSSProperties = { padding: "12px 25px", borderRadius: "12px", border: "none", backgroundColor: "#000", color: "#fff", fontWeight: "800", cursor: "pointer" };
    const sliderSectionStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px", padding: "0 20px", width: "80%", margin: "0 auto" };
    const sliderLabelStyle: React.CSSProperties = { fontSize: "14px", color: "#444", textAlign: "center" };
    const rangeInputStyle: React.CSSProperties = { width: "100%", height: "6px", backgroundColor: "#e0e0e0", borderRadius: "10px", appearance: "none", outline: "none", cursor: "pointer" };
    const rangeLabelsWrapperStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", fontWeight: "600", marginTop: "5px" };
    const suggestionsBoxStyle: React.CSSProperties = { position: "absolute", top: "110%", left: "0", right: "0", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden" };
    const suggestionItemStyle: React.CSSProperties = { padding: "12px 20px", cursor: "pointer", borderBottom: "1px solid #f5f5f5", fontSize: "14px" };
    
    const cartSidebarStyle: React.CSSProperties = { width: "420px", backgroundColor: "#121212", color: "#fff", position: "fixed", inset: "0 0 0 auto", zIndex: 2000, display: "flex", flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,0.6)" };
    const cartHeaderStyle: React.CSSProperties = { padding: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222" };
    const cartItemRowStyle: React.CSSProperties = { display: "flex", gap: "15px", backgroundColor: "#1e1e1e", padding: "15px", borderRadius: "16px", marginBottom: "12px", alignItems: "center" };
    const cartImageWrapperStyle: React.CSSProperties = { width: "85px", height: "85px", backgroundColor: "#fff", borderRadius: "12px", padding: "5px", flexShrink: 0, cursor: "pointer" };
    const qtyBtnStyle: React.CSSProperties = { backgroundColor: "#333", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" };
    const checkoutButtonStyle: React.CSSProperties = { width: "100%", backgroundColor: "#fff", color: "#000", padding: "20px", border: "none", borderRadius: "15px", fontSize: "16px", fontWeight: "900", cursor: "pointer" };

    // --- Queries ---
    const { data: shoesData, isLoading: isShoesLoading } = useQuery({
        queryKey: ["allShoes"],
        queryFn: dataService.getAllShoes,
        select: (shoes: Shoe[]) => ({
            allShoes: shoes,
            uniqueColors: Array.from(shoes.reduce((acc, s) => s.color ? acc.add(s.color) : acc, new Set<string>())).map(c => ({ colorName: c, colorId: c.replace(/\s/g, "") })),
            uniqueSizes: Array.from(new Set(shoes.reduce((acc, s) => s.availableSizes ? [...acc, ...s.availableSizes.split(",").map(Number)] : acc, [] as number[]))).sort((a, b) => a - b)
        })
    });

    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: dataService.getAllCategories });
    const { data: stockData } = useQuery({ queryKey: ["shoesSizes"], queryFn: dataService.getAllShoesSizes1 });
    const { data: allOrdersData, isLoading: isOrdersLoading } = useQuery({ queryKey: ["allOrdersForUser", loggedInUserId], queryFn: () => dataService.getAllOrders3(loggedInUserId as number), enabled: !!loggedInUserId });

    const addOrderMutation = useMutation({
        mutationFn: (vars: { userId: number; shoesId: number; quantity: number; sizeId: number; }) => dataService.handleOrder1(vars.userId, vars.shoesId, vars.quantity, vars.sizeId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allOrdersForUser"] })
    });

    const deleteOrderMutation = useMutation({
        mutationFn: ({ orderId }: { orderId: number }) => dataService.deleteOrder(orderId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allOrdersForUser"] })
    });

    // --- Logic ---
    const suggestions = useMemo(() => {
        if (!shoesData?.allShoes || text.trim() === "") return [];
        return shoesData.allShoes.filter(s => s.title.toLowerCase().includes(text.toLowerCase())).slice(0, 5);
    }, [shoesData?.allShoes, text]);

    const { saleShoesLookup, userCartOrders } = useMemo(() => {
        const shoes = shoesData?.allShoes || [];
        const lookup: SaleShoesLookup = shoes.filter(s => s.shoppingBasket === 1).reduce((acc, s) => ({ ...acc, [s.shoesId]: true }), {});
        const orders = (allOrdersData || []).filter(o => o.userId === loggedInUserId).map(o => {
            const info = shoes.find(s => s.shoesId === o.shoesId);
            return info ? { ...o, title: info.title, price: info.price, imageName: info.imageName } : { ...o, title: "", price: 0, imageName: "" };
        });
        return { saleShoesLookup: lookup, userCartOrders: orders };
    }, [allOrdersData, shoesData?.allShoes, loggedInUserId]);

    const consolidatedCartItems = useMemo(() => {
        const consolidated: { [key: string]: ConsolidatedCartItem } = {};
        userCartOrders.forEach(item => {
            if (item.status === 0 && item.shoesId) {
                const key = `${item.shoesId}-${item.sizeId}`;
                if (consolidated[key]) consolidated[key].quantity += item.quantity;
                else consolidated[key] = { shoesId: item.shoesId, sizeId: item.sizeId, quantity: item.quantity, title: item.title || "", price: (item as any).price || 0, imageName: item.imageName || "", orderId: item.orderId };
            }
        });
        return Object.values(consolidated);
    }, [userCartOrders]);

    const handleIncrementInCart = (item: ConsolidatedCartItem) => {
        const itemStock = stockData?.find(s => s.shoesId === item.shoesId && s.sizeId === item.sizeId)?.stock || 0;
        if (item.quantity + 1 > itemStock) {
            alert(`Sorry, only ${itemStock} items available in size ${item.sizeId}`);
            return;
        }
        addOrderMutation.mutate({ userId: loggedInUserId!, shoesId: item.shoesId, quantity: 1, sizeId: item.sizeId });
    };

    const productsToShow = useMemo(() => {
        let filtered = shoesData?.allShoes || [];
        if (text.trim() !== "") filtered = filtered.filter(s => s.title.toLowerCase().includes(text.toLowerCase()));
        if (showSaleSuggestions) filtered = filtered.filter(s => saleShoesLookup[s.shoesId]);
        if (selectedColor !== "all") filtered = filtered.filter(s => s.color === selectedColor);
        if (selectedSize !== "all") filtered = filtered.filter(s => s.availableSizes?.split(",").includes(selectedSize.toString()));
        if (selectedCategory) filtered = filtered.filter(s => s.categoryId === Number(selectedCategory));
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
        return filtered;
    }, [shoesData?.allShoes, text, selectedColor, selectedSize, selectedCategory, priceRange, showSaleSuggestions, saleShoesLookup]);

    if (isShoesLoading || isOrdersLoading) return <div style={{textAlign: 'center', padding: '100px', fontWeight: 'bold'}}>LOADING NIKE STORE...</div>;

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#e0f2f1'}}>
            <div className="controls-container" style={mainControlsWrapperStyle}>
                <div className="filters-wrapper" style={filtersRowStyle}>
                    <div style={selectContainerStyle}><select className="custom-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={minimalSelectStyle}><option value="">Categories</option>{categories?.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}</select></div>
                    <div style={selectContainerStyle}><select className="custom-select" onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize} style={minimalSelectStyle}><option value="all">Sizes</option>{shoesData?.uniqueSizes?.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div style={selectContainerStyle}><select className="custom-select" onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor} style={minimalSelectStyle}><option value="all">Colors</option>{shoesData?.uniqueColors?.map(c => <option key={c.colorId} value={c.colorName}>{c.colorName}</option>)}</select></div>
                </div>

                <div className="search-row" style={searchRowStyle}>
                    <div style={searchInputWrapperStyle}>
                        <input className="search-input-field" type="text" value={text} onChange={(e) => { setText(e.target.value); setShowSuggestions(true); }} placeholder="Search sneakers..." style={minimalInputStyle} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-box" style={suggestionsBoxStyle}>
                                {suggestions.map(s => (
                                    <div key={s.shoesId} onMouseDown={(e) => { e.preventDefault(); setText(s.title); setShowSuggestions(false); }} style={suggestionItemStyle}>
                                        {s.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* ✅ הכפתורים האלו עכשיו רחוקים יותר שמאלה בגלל ה-gap: 30px */}
                    <button style={clearButtonStyle} onClick={() => setText("")}>Clear</button>
                    <button style={saleButtonStyle} onClick={() => setShowSaleSuggestions(!showSaleSuggestions)}>{showSaleSuggestions ? "All" : "Our Sale"}</button>
                </div>

                <div className="slider-section" style={sliderSectionStyle}>
                    <div style={sliderLabelStyle}>Max Price: <strong style={{fontSize: '15px', color: '#000'}}>{priceRange.max} ₪</strong></div>
                    <input type="range" min="0" max="1000" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({...prev, max: Number(e.target.value)}))} style={rangeInputStyle} />
                    <div style={rangeLabelsWrapperStyle}><span>0 ₪</span><span>1000 ₪</span></div>
                </div>
            </div>

            <div className="content-area">
                {isProductsListPage ? (
                    <ProductUserCard filteredShoes={productsToShow} saleShoesLookup={saleShoesLookup} stockData={{}} />
                ) : <Outlet />}
            </div>

            {/* כפתור עגלה */}
            <div className="cart-trigger" onClick={() => setShowCart(true)} style={{position: "fixed", top: "20px", right: "20px", zIndex: 1500, cursor: "pointer", width: "60px", height: "60px", backgroundColor: "#111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"}}>
                <svg width="30" height="30" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/></svg>
                {consolidatedCartItems.length > 0 && <span style={{position: "absolute", top: "-5px", left: "-5px", backgroundColor: "#ff4d4d", color: "white", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "2px solid white"}}>{consolidatedCartItems.length}</span>}
            </div>

            {showCart && (
                <div className="cartTab1 active" style={cartSidebarStyle}>
                    <div style={cartHeaderStyle}>
                        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "900" }}>MY CART</h1>
                        <button onClick={() => setShowCart(false)} style={{background:"none", border:"none", color:"#fff", fontSize:"26px", cursor:"pointer"}}>✕</button>
                    </div>
                    <div style={{ padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        {consolidatedCartItems.length > 0 ? (
                            <>
                                {consolidatedCartItems.map((cartItem) => (
                                    <div key={`${cartItem.shoesId}-${cartItem.sizeId}`} style={cartItemRowStyle}>
                                        <div style={cartImageWrapperStyle} onClick={() => setShowCart(false)}>
                                            <Link to="/user/shoesUsers/$shoesId" params={{ shoesId: cartItem.shoesId.toString() }}>
                                                <img src={appConfig.shoesImagesUsersUrl + cartItem.imageName} alt={cartItem.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                            </Link>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{ fontWeight: "700", fontSize: "15px" }}>{cartItem.title}</div>
                                            <div style={{ fontSize: "13px", color: "#888" }}>Size: {cartItem.sizeId}</div>
                                            <div style={{ marginTop: "5px", fontWeight: "800" }}>₪{cartItem.price.toFixed(2)}</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
                                                <button style={qtyBtnStyle} onClick={() => deleteOrderMutation.mutate({orderId: cartItem.orderId})}>—</button>
                                                <span style={{fontWeight: "bold"}}>{cartItem.quantity}</span>
                                                <button style={qtyBtnStyle} onClick={() => handleIncrementInCart(cartItem)}>＋</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div style={{marginTop: "15px", padding: "20px", borderTop: "1px solid #222", backgroundColor: "#1a1a1a", borderRadius: "15px"}}>
                                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "900", color: "#fff", marginBottom: "15px"}}>
                                        <span>Total:</span>
                                        <span>₪{consolidatedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                                    </div>
                                    <Link to="/user/creditCardForm" style={{ textDecoration: "none" }}>
                                        <button style={checkoutButtonStyle}>CHECKOUT NOW</button>
                                    </Link>
                                </div>
                            </>
                        ) : <div style={{textAlign: 'center', marginTop: '100px', color: '#666'}}>Your bag is empty.</div>}
                    </div>
                </div>
            )}
            <div style={{position: "fixed", bottom: "20px", right: "20px", zIndex: 1000}}><ProductAiChat productDescription="Nike Expert" /></div>
        </div>
    );
}

export default ProductsUsers;