import React from "react";
import appConfig from "../Utils/AppConfig";
import { Link } from "@tanstack/react-router";

// --- Interfaces (ללא שינוי) ---
export interface Shoe {
  shoesId: number;
  title: string;
  imageName: string;
  price: number;
  color?: string;
  availableSizes?: string;
  categoryId: number;
  shoppingBasket?: number;
}

export interface SaleShoesLookup { [shoesId: number]: boolean; }
export interface StockData { [shoesId: number]: boolean; }

interface ProductUserCardProps {
  filteredShoes: Shoe[];
  saleShoesLookup?: SaleShoesLookup;
  stockData?: StockData;
}

function ProductUserCard({ filteredShoes, saleShoesLookup, stockData }: ProductUserCardProps) {
  if (!filteredShoes || filteredShoes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px", width: "100%" }}>
        <p>No products found matching the filter.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: "20px 0" }}>
      <div style={gridContainerStyle}>
        {filteredShoes.map((shoe) => (
          <div 
            key={shoe.shoesId} 
            style={cardWrapperStyle}
            // אפקט "התרוממות" לכרטיס כולו
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Link
              to="/user/shoesUsers/$shoesId"
              params={{ shoesId: shoe.shoesId.toString() }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {/* מיכל התמונה עם אפקט Zoom */}
              <div style={imageBoxReducedHeightStyle}>
                <img 
                  src={appConfig.shoesImagesUsersUrl + shoe.imageName} 
                  alt={shoe.title} 
                  style={fullWidthScaledImageStyle} 
                  // אפקט הגדלה לתמונה עצמה
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                {stockData && stockData[shoe.shoesId] && (
                  <div style={outOfStockBadgeStyle}>OUT OF STOCK</div>
                )}
              </div>

              {/* פרטי הנעל */}
              <div style={infoSectionStyle}>
                <h2 style={productTitleStyle}>{shoe.title}</h2>
                <div style={productColorStyle}>{shoe.color || "Classic Nike Edition"}</div>
                
                <div style={priceSectionStyle}>
                  {saleShoesLookup && saleShoesLookup[shoe.shoesId] ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={strikePriceStyle}>₪{shoe.price}</span>
                      <span style={salePriceStyle}>
                        ₪{(shoe.price * 0.8).toFixed(2)} (20% Off)
                      </span>
                    </div>
                  ) : (
                    <div style={regularPriceStyle}>₪{shoe.price}</div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- סגנונות מעודכנים עם אנימציות --- */

const gridContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
  width: "100%",
  padding: "0 20px",
  boxSizing: "border-box"
};

const cardWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "transparent",
  overflow: "hidden",
  borderRadius: "8px",
  padding: "10px",
  transition: "all 0.3s ease-in-out", // מעבר חלק לכל השינויים
  cursor: "pointer"
};

const imageBoxReducedHeightStyle: React.CSSProperties = {
  width: "100%",
  height: "360px", 
  backgroundColor: "#f6f6f6", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden", // חשוב כדי שהתמונה לא תצא מהגבולות בזום
  borderRadius: "4px"
};

const fullWidthScaledImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.5s ease" // אנימציית זום חלקה ואיטית
};

const infoSectionStyle: React.CSSProperties = {
  padding: "12px 0",
  textAlign: "left"
};

const productTitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "800",
  margin: "0 0 4px 0",
  color: "#111"
};

const productColorStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#666",
  margin: "0 0 10px 0"
};

const priceSectionStyle: React.CSSProperties = {
  marginTop: "5px"
};

const regularPriceStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "700"
};

const strikePriceStyle: React.CSSProperties = {
  textDecoration: "line-through",
  color: "#999",
  fontSize: "0.85rem"
};

const salePriceStyle: React.CSSProperties = {
  color: "#d93921",
  fontWeight: "800",
  fontSize: "1.15rem"
};

const outOfStockBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "#fff",
  padding: "4px 10px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  borderRadius: "2px",
  zIndex: 2
};

export default ProductUserCard;