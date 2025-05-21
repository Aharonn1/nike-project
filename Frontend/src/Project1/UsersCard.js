import React, { useState, useEffect } from "react";

export default function UsersCard(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(props.users);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const filtered = props.users.filter((order) => {
      const user = props.users.find((user) => user.userId === order.userId);
      const fullName = `${user?.firstName} ${user?.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) && order.status === 1;
    });

    const totalSum = filtered.reduce(
      (sum, order) => sum + order.total_quantity * order.price,
      0
    );
    console.log(totalSum);
    console.log(filtered);
    setFilteredOrders(filtered);

    setTotalPrice(totalSum);
    console.log(filtered);
    setFilteredOrders(filtered);
  }, [searchTerm, props.orders, props.users]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const countOrders = () => {
    return filteredOrders.length;
  };

  return (
    <div>
      <h1 className="section-title">Customers</h1>
      <input
        type="text"
        placeholder="Search by customer name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input" 
      />
      <div className="summary">
        <p className="total-orders">Total Orders: {countOrders()}</p>
        <p className="total-price">Total Price: {totalPrice} ₪</p>
      </div>

      {filteredOrders.length > 0 ? (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Join Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const user = props.users.find(
                (user) => user.userId === order.userId
              );
              const product = props.shoes.find(
                (product) => product.shoesId === order.shoesId
              );

              return (
                <tr key={order.orderId}>
                  <td>
                    {user?.firstName} {user?.lastName}
                  </td>
                  <td>
                    {user?.registrationDate
                      ?.slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("/")}
                  </td>
                  <td>{product?.title || "-"}</td>
                  <td>{order.total_quantity}</td>
                  <td>
                    {order.order_date
                      ?.slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("/")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
}