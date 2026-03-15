import "react-credit-cards-2/dist/es/styles-compiled.css";
import dataService from "../Service/DataService";
import { useState, useMemo } from "react";
import Cards from "react-credit-cards-2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock, FaCheckCircle, FaStar } from "react-icons/fa";

const PaymentForm = () => {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackComment, setFeedbackComment] = useState("");
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState<any>({});
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [state, setState] = useState({
        number: "",
        expiry: "",
        cvc: "",
        name: "",
        focus: "",
    });

    const [orderIdsForFeedback, setOrderIdsForFeedback] = useState<number[]>([]);
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = loggedInUser?.userData?.userId;

    const { data: allUserOrders } = useQuery({
        queryKey: ["userOrders", userId],
        queryFn: () => dataService.getAllOrders3(userId),
        enabled: !!userId,
    });

    const ordersToPay = useMemo(() => 
        allUserOrders ? allUserOrders.filter((o: any) => o.userId === userId && (o.status === 0 || o.status === 3)) : []
    , [allUserOrders, userId]);

    const finalPrice = useMemo(() => {
        return ordersToPay.reduce((sum: number, order: any) => {
            const actualPrice = order.shoppingBasket === 1 ? order.price * 0.8 : order.price;
            return sum + (actualPrice * order.quantity);
        }, 0);
    }, [ordersToPay]);

    // 🎯 הפונקציה המעודכנת: בלי newStatus, רק IDs ו-userId כפי שמוגדר ב-Service
    const updateOrdersStatusMutation = useMutation({
        mutationFn: async (orderIds: number[]) => {
            // שינוי הסטטוס בזיכרון ל-1 (כדי שה-UI יתעדכן מיד)
            ordersToPay.forEach((order: any) => {
                if (orderIds.includes(order.orderId)) {
                    order.status = 1;
                }
            });

            // 🟢 קריאה ל-Service עם 2 ארגומנטים בלבד: IDs ו-userId
            await dataService.updateOrdersStatus(orderIds, userId);
            
            return { orderIds };
        },
        onSuccess: (data) => {
            // ניקוי הקאש כדי לוודא שהסל מתרוקן
            queryClient.setQueryData(["userOrders", userId], (oldData: any) => {
                if (!oldData) return [];
                return oldData.map((order: any) => 
                    data.orderIds.includes(order.orderId) ? { ...order, status: 1 } : order
                );
            });
            queryClient.invalidateQueries({ queryKey: ["userOrders", userId] });
            
            setOrderIdsForFeedback(data.orderIds);
            setShowFeedbackModal(true);
        }
    });

    const updateFeedbackMutation = useMutation({
        mutationFn: (vars: any) => dataService.updateUserExperience(vars.orderIds, vars.rating, vars.comment),
        onSuccess: () => {
            alert("Payment successful! Status updated to 1.");
            navigate({ to: "/user/shoesUsers" });
        }
    });

    const handleInputChange = (evt: any) => {
        const { name, value } = evt.target;
        let val = value;
        if (name === "number") val = value.replace(/\D/g, "").slice(0, 16);
        if (name === "expiry") val = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2").slice(0, 5);
        if (name === "cvc") val = value.replace(/\D/g, "").slice(0, 3);
        setState((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (state.number.length < 16) return setErrors({ number: "Invalid card" });
        const ids = ordersToPay.map((o: any) => o.orderId);
        
        // הפעלת המוטציה ללא newStatus
        updateOrdersStatusMutation.mutate(ids);
    };

    if (showFeedbackModal) {
        return (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <FaCheckCircle style={{fontSize: '60px', color: '#2ecc71', marginBottom: '20px'}}/>
                    <h2 style={{fontWeight: 900}}>SUCCESSFUL!</h2>
                    <p>Your order has been placed and status set to 1.</p>
                    <div style={ratingWrapper}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} onClick={() => setRating(star)}
                                style={{ cursor: "pointer", color: star <= rating ? "#f1c40f" : "#ddd", fontSize: "35px", margin: "0 5px" }}
                            />
                        ))}
                    </div>
                    <textarea placeholder="Tell us more..." value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)} style={textAreaStyle} />
                    <div style={{display: 'flex', gap: '15px', marginTop: '25px'}}>
                        <button onClick={() => updateFeedbackMutation.mutate({orderIds: orderIdsForFeedback, rating, comment: feedbackComment})} style={primaryBtn}>Submit</button>
                        <button onClick={() => navigate({ to: "/user/shoesUsers" })} style={secondaryBtn}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={pageWrapper}>
            <style>{inputFocusStyle}</style>
            <div style={paymentContainer}>
                <div style={formSide}>
                    <h2 style={{fontWeight: 900, marginBottom: '30px', textTransform: 'uppercase'}}>Secure Payment</h2>
                    <div style={{marginBottom: '40px'}}>
                        <Cards number={state.number} name={state.name} expiry={state.expiry} cvc={state.cvc} focused={state.focus as any} />
                    </div>
                    <form onSubmit={handleSubmit} style={formGrid}>
                        <div style={inputBox}>
                            <label style={labelStyle}><FaCreditCard style={iconStyle}/> Card Number</label>
                            <input type="tel" name="number" placeholder="XXXX XXXX XXXX XXXX" value={state.number} onChange={handleInputChange} onFocus={(e) => setState({...state, focus: e.target.name})} style={inputStyle} />
                        </div>
                        <div style={inputBox}>
                            <label style={labelStyle}><FaUser style={iconStyle}/> Name</label>
                            <input type="text" name="name" placeholder="Full Name" value={state.name} onChange={(e) => setState({...state, name: e.target.value})} onFocus={(e) => setState({...state, focus: e.target.name})} style={inputStyle} />
                        </div>
                        <div style={{display: 'flex', gap: '20px'}}>
                            <div style={{flex: 1}}>
                                <label style={labelStyle}><FaCalendarAlt style={iconStyle}/> Expiry</label>
                                <input type="text" name="expiry" placeholder="MM/YY" value={state.expiry} onChange={handleInputChange} onFocus={(e) => setState({...state, focus: e.target.name})} style={inputStyle} />
                            </div>
                            <div style={{flex: 1}}>
                                <label style={labelStyle}><FaLock style={iconStyle}/> CVC</label>
                                <input type="password" name="cvc" placeholder="***" value={state.cvc} onChange={handleInputChange} onFocus={(e) => setState({...state, focus: e.target.name})} style={inputStyle} />
                            </div>
                        </div>
                        <button type="submit" disabled={updateOrdersStatusMutation.isPending} style={payBtnStyle}>
                            {updateOrdersStatusMutation.isPending ? "VERIFYING..." : `PAY ₪${finalPrice.toFixed(2)} NOW`}
                        </button>
                    </form>
                </div>
                <div style={summarySide}>
                    <h3 style={{fontWeight: 800, borderBottom: '2px solid #eee', paddingBottom: '15px'}}>SUMMARY</h3>
                    <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {ordersToPay.map((item: any) => {
                            const itemPrice = item.shoppingBasket === 1 ? item.price * 0.8 : item.price;
                            return (
                                <div key={item.orderId} style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                                    <span>{item.title} (x{item.quantity})</span>
                                    <span style={{fontWeight: 700}}>₪{(itemPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={totalRow}>
                        <span>TOTAL</span>
                        <span style={{fontSize: '26px', fontWeight: 900}}>₪{finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- Styles --- */
const inputFocusStyle = `input:focus { border-color: #000 !important; outline: none; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }`;
const pageWrapper: React.CSSProperties = { padding: "50px 20px", display: "flex", justifyContent: "center", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const paymentContainer: React.CSSProperties = { display: "flex", maxWidth: "1000px", width: "100%", backgroundColor: "#fff", borderRadius: "30px", boxShadow: "0 25px 60px rgba(0,0,0,0.1)", overflow: "hidden" };
const formSide: React.CSSProperties = { flex: 1.5, padding: "50px", borderRight: "1px solid #f0f0f0" };
const summarySide: React.CSSProperties = { flex: 1, padding: "50px", backgroundColor: "#fafafa" };
const formGrid: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px" };
const inputBox: React.CSSProperties = { marginBottom: "25px", display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle: React.CSSProperties = { fontSize: "11px", fontWeight: "900", color: "#888", textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { padding: "16px", borderRadius: "12px", border: "2px solid #eee", fontSize: "16px", transition: "0.3s" };
const iconStyle: React.CSSProperties = { marginRight: "5px", color: "#111" };
const payBtnStyle: React.CSSProperties = { marginTop: "30px", padding: "20px", borderRadius: "50px", border: "none", backgroundColor: "#000", color: "#fff", fontWeight: "900", cursor: "pointer", fontSize: "16px" };
const totalRow: React.CSSProperties = { marginTop: "30px", paddingTop: "20px", borderTop: "3px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" };
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle: React.CSSProperties = { backgroundColor: "#fff", padding: "60px", borderRadius: "40px", textAlign: "center", maxWidth: "500px", width: "90%" };
const textAreaStyle: React.CSSProperties = { width: "100%", marginTop: "20px", padding: "15px", borderRadius: "15px", border: "1px solid #eee", resize: "none" };
const ratingWrapper: React.CSSProperties = { margin: "30px 0" };
const primaryBtn: React.CSSProperties = { flex: 1, padding: "18px", borderRadius: "50px", border: "none", backgroundColor: "#000", color: "#fff", fontWeight: "800", cursor: "pointer" };
const secondaryBtn: React.CSSProperties = { padding: "18px 35px", borderRadius: "50px", border: "1px solid #ddd", background: "none", cursor: "pointer", fontWeight: "700" };

export default PaymentForm;