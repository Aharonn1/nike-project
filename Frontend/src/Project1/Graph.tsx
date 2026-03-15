import React, { useState, useEffect, useMemo } from "react";
import dataService from "../Service/DataService";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { FaChartBar, FaUserFriends, FaShoppingCart } from "react-icons/fa";

interface AnalyticsOrder {
  shoesId: number;
  title: string;
  total_quantity: any;
  userId: number;
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
}

const StoreAnalytics = () => {
  const [mainChartData, setMainChartData] = useState<any[]>([]); // לגרף הגדול
  const [rawOrders, setRawOrders] = useState<any[]>([]); // לסינון הלקוחות (התיקון!)
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [filteredChartData, setFilteredChartData] = useState<any[]>([]);
  const [totalUnitsSold, setTotalUnitsSold] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      console.log("🚀 [DEBUG] שלב 1: טעינת נתונים משולבת...");
      try {
        const [summaryResponse, rawOrdersResponse, usersResponse] = await Promise.all([
          dataService.getAllOrdersAndShoesForAdmin(), // נתונים מקובצים לגרף שמאל
          dataService.getAllOrdersPerMonth(),         // נתונים מפורטים לגרף ימין (התיקון הקריטי!)
          dataService.getAllUsers(),
        ]);

        console.log("📦 [DEBUG] נתוני סיכום לגרף ראשי:", summaryResponse);
        console.log("📄 [DEBUG] נתוני הזמנות גולמיים לסינון:", rawOrdersResponse);

        // הגדרת הגרף הראשי
        const mainData = (summaryResponse || []).map((item: any) => ({
          title: item.title || "Unknown",
          value: parseInt(item.total_quantity) || 0
        }));
        setMainChartData(mainData);

        // שמירת ההזמנות הגולמיות לסינון עתידי
        setRawOrders(rawOrdersResponse || []);

        // חישוב סך הכל יחידות
        const total = mainData.reduce((sum, item) => sum + item.value, 0);
        setTotalUnitsSold(total);

        // חילוץ משתמשים ייחודיים
        const uniqueUsers = (usersResponse || []).filter((user: User, index: number, self: User[]) => {
          return user && user.userId && self.findIndex((u) => u.userId === user.userId) === index;
        });
        setUsers(uniqueUsers);

      } catch (error) {
        console.error("❌ [DEBUG] שגיאה בטעינה:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userIdFromSelect = event.target.value;
    setSelectedUserId(userIdFromSelect);

    if (!userIdFromSelect) {
      setFilteredChartData([]);
      return;
    }

    console.log("🔍 [DEBUG] מסנן מתוך rawOrders עבור ID:", userIdFromSelect);

    // 🎯 התיקון: מסננים מתוך המערך המפורט (rawOrders) ולא מתוך הסיכום (mainChartData)
    const userOrders = rawOrders.filter(o => Number(o.userId) === Number(userIdFromSelect));

    console.log("📊 [DEBUG] נמצאו הזמנות מפורטות:", userOrders);

    const grouped: { [key: string]: number } = {};
    userOrders.forEach(order => {
      const shoeTitle = order.shoeTitle || order.title || "Unknown";
      const qty = parseInt(order.quantity) || parseInt(order.total_quantity) || 1;
      grouped[shoeTitle] = (grouped[shoeTitle] || 0) + qty;
    });

    const formattedData = Object.entries(grouped).map(([title, quantity]) => ({
      title: title,
      value: quantity 
    }));

    console.log("📈 [DEBUG] נתונים לגרף ימין:", formattedData);
    setFilteredChartData(formattedData);
  };
  
  if (isLoading) return <div className="loading-msg">Generating Intelligence Report...</div>;

  return (
    <div className="analytics-page">
      <style>{dashboardStyles}</style>

      <header className="analytics-header">
        <h1><FaChartBar /> Store Performance Intelligence</h1>
        <p>Real-time inventory and customer acquisition data</p>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><FaShoppingCart /></div>
          <div className="kpi-content">
            <span>Total Units Sold</span>
            <h3>{totalUnitsSold.toLocaleString()} Units</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaUserFriends /></div>
          <div className="kpi-content">
            <span>Customer Base</span>
            <h3>{users.length} Unique</h3>
          </div>
        </div>
      </div>

      <div className="charts-main-layout">
        <div className="chart-container-card">
          <div className="card-header-box">
            <h3><FaChartBar /> Global Sales Metrics</h3>
            <p>Overall product distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={mainChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="value" name="Sold" fill="#000" radius={[6, 6, 0, 0]} barSize={35} />
              <Line type="monotone" dataKey="value" stroke="#f39c12" strokeWidth={3} dot={{ r: 4, fill: '#f39c12', strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container-card">
          <div className="card-header-box filter-header">
            <div className="header-text">
              <h3><FaUserFriends /> Account Analysis</h3>
              <p>Individual purchase history</p>
            </div>
            <select className="premium-select" value={selectedUserId} onChange={handleUserChange}>
              <option value="">Select Account...</option>
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="chart-body">
            {selectedUserId ? (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" name="Qty" fill="#333" radius={[4, 4, 0, 0]} barSize={22} />
                  <Line type="monotone" dataKey="value" stroke="#f39c12" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state-msg">Select a customer to view their trends</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const dashboardStyles = `
  .analytics-page { padding: 25px 2%; background: #fcfcfc; min-height: 100vh; font-family: 'Inter', sans-serif; overflow-x: hidden; }
  .analytics-header { margin-bottom: 30px; text-align: center; }
  .analytics-header h1 { font-size: 2.5rem; font-weight: 950; letter-spacing: -2px; text-transform: uppercase; margin: 0; display: flex; align-items: center; justify-content: center; gap: 15px; }
  .analytics-header p { color: #888; font-size: 0.9rem; }
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; max-width: 1600px; margin-left: auto; margin-right: auto; }
  .kpi-card { background: #fff; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f0f0f0; }
  .kpi-icon { width: 50px; height: 50px; background: #000; color: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .kpi-content span { color: #aaa; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; }
  .kpi-content h3 { margin: 0; font-size: 1.5rem; font-weight: 900; }
  .charts-main-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 25px; max-width: 1600px; margin: 0 auto; }
  @media (max-width: 1200px) { .charts-main-layout { grid-template-columns: 1fr; } }
  .chart-container-card { background: #fff; border-radius: 35px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.05); border: 1px solid #f2f2f2; }
  .card-header-box { margin-bottom: 20px; border-bottom: 1px solid #f8f8f8; padding-bottom: 15px; }
  .card-header-box h3 { margin: 0; font-size: 1.1rem; font-weight: 850; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
  .card-header-box p { color: #aaa; font-size: 0.8rem; margin: 0; }
  .filter-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .premium-select { padding: 8px 12px; border-radius: 10px; border: 2px solid #eee; font-weight: 700; cursor: pointer; background: #fafafa; font-size: 0.8rem; }
  .empty-state-msg { height: 250px; display: flex; align-items: center; justify-content: center; color: #ccc; font-style: italic; text-align: center; border: 2px dashed #f9f9f9; border-radius: 20px; }
  .loading-msg { text-align: center; padding: 100px; font-weight: 900; color: #ddd; letter-spacing: 4px; }
`;

export default StoreAnalytics;