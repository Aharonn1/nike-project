import { PureComponent } from "react";
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
} from "recharts";

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
      selectedUser: null,
      totalQuantity: 0, // מצב חדש לסך כמות ההזמנות
      allOrdersQuantityData: [], // מצב חדש עבור סך כמות ההזמנות
      shoeTypesOrderedCount: 0, // <-- הוספנו מצב למספר סוגי הנעליים
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

        const mergedData = ordersResponse.map((order, index) => ({
          value: order.total_quantity,
          title: order.title,
        }));

        console.log("mergedData", mergedData);
        const uniqueUsers = usersResponse.filter((user, index, self) => {
          return self.findIndex((u) => u.userId === user.userId) === index;
        });

        console.log("uniqueUsers", uniqueUsers); // שמירת המשתמשים הייחודיים ב-state
        const totalQuantityAllOrders = ordersResponse.reduce((sum, order) => {
          return sum + order.total_quantity;
        }, 0);

        console.log("totalQuantityAllOrders", totalQuantityAllOrders);

        const groupedShoesQuantity = ordersResponse.reduce((acc, order) => {
          acc[order.shoesId] = acc[order.shoesId] || {
            total_quantity: 0,
            title: order.title,
          };
          acc[order.shoesId].total_quantity += order.quantity;
          return acc;
        }, {});

        const allOrdersQuantityData1 = Object.keys(groupedShoesQuantity).map(
          (item) => ({
            title: item.title,
            value: item.total_quantity,
          })
        );
        // יצירת מבנה נתונים לגרף (אובייקט בודד עם הסכום)
        const allOrdersQuantityData = [
          {
            title: "סך כל ההזמנות",
            value: totalQuantityAllOrders,
          },
        ];

        console.log("allOrdersQuantityData", allOrdersQuantityData);
        // console.log(mergedData);
        this.setState({
          orders: mergedData,
          users: uniqueUsers,
          error: null,
          allOrdersQuantityData: allOrdersQuantityData, // שמירת סך הכמות במצב
          allOrdersQuantityData1: allOrdersQuantityData1,
        });
      } catch (error) {
        this.setState({ error: "שגיאה בטעינת הנתונים" });
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }

  filterProductsByCategory = (userId) => {
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

    const chartData = Object.values(groupedOrders).map((item) => ({
      title: item.title,
      quantity: item.total_quantity,
      orderStatus: item.orderStatus,
      value: item.value,
    }));

    const totalQuantityByUser = filteredOrders.reduce((sum, order) => {
      return sum + order.total_quantity;
    }, 0);

    const groupedShoesByUser = filteredOrders.reduce((acc, order) => {
      acc[order.shoesId] = (acc[order.shoesId] || 0) + order.total_quantity;
      return acc;
    }, {});

    console.log("groupedShoesByUser", groupedShoesByUser);

    console.log("totalQuantityByUser", totalQuantityByUser);

    return Promise.resolve(chartData);
  };

  handleUserChange = async (event) => {
    const userId = event.target.value;
    this.setState({ selectedUser: userId });
    if (userId) {
      try {
        const filteredOrdersData = await this.filterOrdersByUser(userId);
        this.setState({ filteredOrders: filteredOrdersData });
        // עדכון סך הכמות כאן
        const totalQuantity = filteredOrdersData.reduce(
          (sum, order) => sum + order.quantity,
          0
        );
        this.setState({ totalQuantity: totalQuantity });
      } catch (error) {
        console.error("Error filtering orders:", error);
        this.setState({ error: "שגיאה בסינון ההזמנות" });
      }
    } else {
      this.setState({
        filteredOrders: [],
        totalQuantity: 0,
        shoeTypesOrderedCount: 0,
      }); // איפוס
    }
  };

  render() {
    const {
      orders,
      error,
      allOrdersQuantityData,
      groupedOrders,
      filteredOrders,
    } = this.state; // достаем  allOrdersQuantityData
    console.log("orders in render:", orders); // הוספת בדיקה להדפסת המערך orders
    console.log("orders in render:", filteredOrders); // הוספת בדיקה להדפסת המערך orders

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
            {allOrdersQuantityData.length > 0 && (
              <>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Total quantity of shoes ordered :{" "}
                  {allOrdersQuantityData[0].value}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  "The number of types of shoes ordered" : {orders.length}
                </div>
                <ComposedChart
                  width={800}
                  height={532}
                  data={orders}
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
                  <Bar
                    dataKey="value"
                    barSize={20}
                    fill="#8884d8"
                    name="Total Quantity"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="red"
                    dot={{ r: 5 }}
                    name="Total Quantity"
                  />
                  <Line type="monotone" stroke="#ff7300" />
                </ComposedChart>
              </>
            )}
            {!allOrdersQuantityData.length && <p>No orders data available.</p>}
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
            {this.state.selectedUser && (
              <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                Total quantity of shoes ordered : {this.state.totalQuantity}
                {/* כמות סוגי הנעליים שהוזמנו: {this.state.shoeTypesOrderedCount}{" "} */}
              </div>
            )}
            {/* הצגת כמות סוגי הנעליים */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              {/* כמות סוגי הנעליים שהוזמנו: {filteredOrders.length} */}
            </div>
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
                stroke="red"
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
