import React, { PureComponent, useEffect } from "react";

import { PieChart, Pie, Cell } from "recharts";
import dataService from "../Service/DataService";
import {
  ComposedChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Page B",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: "Page C",
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: "Page D",
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
  {
    name: "Page E",
    uv: 1520,
    pv: 1108,
    amt: 1100,
  },
  {
    name: "Page F",
    uv: 1400,
    pv: 680,
    amt: 1700,
  },
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Example extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shoes: [],
      orders: [],
      orders3: [],
      users: [],
      error: null,
      selectedUser: null, // הוספת משתנה state עבור המשתמש שנבחר
    };
  }

  static demoUrl =
    "https://codesandbox.io/p/sandbox/composed-chart-of-same-data-3cs8ym";

  componentDidMount() {
    const fetchData = async () => {
      try {
        const [ordersResponse, shoesResponse, usersResponse] =
          await Promise.all([
            dataService.getAllOrdersAndShoesForAdmin(),
            dataService.getAllShoes(),
            dataService.getAllUsers(),
          ]);

        // if (ordersResponse.length !== shoesResponse.length && usersResponse) {
        //   this.setState({
        //     error: "נמצאה שגיאה בנתונים: מספר ההזמנות אינו תואם למספר הנעליים",
        //   });
        //   return;
        // }

        const mergedData = ordersResponse.map((order, index) => ({
          value: order.total_quantity,
          title: shoesResponse[index].title,
      }));

        // יצירת מערך חדש עם משתמשים ייחודיים

        const uniqueUsers = usersResponse.filter((user, index, self) => {
          return self.findIndex((u) => u.userId === user.userId) === index;
        });
        console.log("uniqueUsers", uniqueUsers); // שמירת המשתמשים הייחודיים ב-state

        console.log(mergedData);
        //   console.log("usersResponse", usersResponse);
        this.setState({
          orders: mergedData,
          users: uniqueUsers,
          error: null,
        });
      } catch (error) {
        this.setState({ error: "שגיאה בטעינת הנתונים" });
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }

  filterProductsByCategory = (userId) => {
    // const [shoes, setShoes] = useState([]);
    if (!userId) return this.state.users; // Return all shoes if no category selected
    // Ensure categoryId is a number for comparison
    const numericCategoryId = Number(userId);
    return this.state.users.filter(
      (user) => Number(user.userId) === numericCategoryId
    );
  };

  filterOrdersByUser = async (userId) => {
    const response = await dataService.getAllOrders();
    const filteredOrders = response.filter(
      (order) => order.userId.toString() === userId
    );
    console.log("filteredOrders", filteredOrders);

    // קיבוץ ההזמנות לפי סוג מוצר וספירת הכמויות
    const groupedOrders = filteredOrders.reduce((acc, order) => {
      const productKey = order.shoesId; // או כל שדה אחר שמייצג את סוג המוצר
      acc[productKey] = acc[productKey] || {
        shoesId: order.shoesId,
        title: order.title,
        orderStatus: order.orderStatus,
        total_quantity: 0,
        value: order.value,
      };
      acc[productKey].total_quantity += order.total_quantity; // הוספת הכמות של ההזמנה הנוכחית
      return acc;
    }, {});

    console.log("groupedOrders", groupedOrders);

    // שינוי מבנה הנתונים למערך של אובייקטים
    const chartData = Object.values(groupedOrders).map((item) => ({
      title: item.title,
      quantity: item.total_quantity,
      orderStatus: item.orderStatus,
      value: item.value,
    }));

    return Promise.resolve(chartData);
  };

  // ... (שאר הקוד שלך)

  handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    this.filterOrdersByUser(selectedUserId)
      .then((groupedOrders) => {
        if (!groupedOrders || typeof groupedOrders !== "object") {
          console.error("Invalid groupedOrders:", groupedOrders);
          return;
        }

        const chartData = Object.entries(groupedOrders).map(
          ([shoesId, { title, quantity, value }]) => ({
            shoesId,
            title,
            quantity,
            value,
          })
        );
        console.log("chartData" , chartData)
        this.setState({
          selectedUser: selectedUserId,
          filteredOrders: chartData,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  render() {
    const { orders, error } = this.state;
    console.log("orders in render:", orders); // הוספת בדיקה להדפסת המערך orders

    return (
      <div className="charts-container " style={{ display: "flex" }}>
        <div
          className="card"
          style={{ width: "800px", height: "500px", marginRight: "20px" }}
        >
          <div className="card-header">
            <h3>All products</h3>
          </div>
          <div className="card-body">
            {error ? (
              <p>{error}</p>
            ) : (
              <ComposedChart
              width={800}
              height={500}
              data={this.state.orders}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="red" // כאן תוכל לשנות גם את צבע הגרף השני
                dot={{ r: 5 }}
              />
              <Bar dataKey="value" barSize={20} fill="#413ea0" />
              <Line type="monotone" stroke="#ff7300" />
            </ComposedChart>
            )}
          </div>
        </div>
        <div className="card" style={{ width: "500px", height: "500px" }}>
        <div className="card-header">
            <h3>Graph per customer</h3>
          </div>
          <div
            className="card-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px", // Optional: Add padding for better spacing
            }}
          >
            <select
              value={this.state.selectedUser}
              onChange={this.handleUserChange}
              style={{ width: "200px", marginBottom: "20px" }}
            >
              <option value="">Choose user</option>
              {this.state.users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.firstName}
                </option>
              ))}
            </select>

            <ComposedChart
              width={500}
              height={400}
              data={this.state.filteredOrders}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="red" // כאן תוכל לשנות גם את צבע הגרף השני
                dot={{ r: 5 }}
              />
              <Bar dataKey="quantity" barSize={20} fill="#413ea0" />
              <Line type="monotone" stroke="#ff7300" />
            </ComposedChart>
          </div>
        </div>
      </div>
    );
  }
}

export default Example;
