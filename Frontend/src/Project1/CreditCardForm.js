import "react-credit-cards-2/dist/es/styles-compiled.css";
import React, { useState, useEffect } from "react";
import dataService from "../Service/DataService";
import Cards from "react-credit-cards-2";
import notify from "./Notyf";
import { useNavigate } from 'react-router-dom'; // לייבא את useNavigate


const PaymentForm = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [ordersToPay, setOrdersToPay] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false); // מצב חדש להצלחת הזמנה
  // const [loadingPayment, setLoadingPayment] = useState(false); 

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const [errors, setErrors] = useState({});
  const [filteredOrders, setFilteredOrders] = useState(null); // Store filtered orders
  const navigate = useNavigate(); // להגדיר useNavigate

  useEffect(() => {
    const fetchShoeData = async () => {
      try {
        const response2 = await dataService.getAllOrders2(loggedInUser.userData.userId);
        const filtered = response2.filter(
          (order) => order.userId === loggedInUser.userData.userId && order.status === 0
        );
        setFilteredOrders(filtered);
        setOrdersToPay(filtered);
        const calculatedTotalPrice = filtered.reduce(
          (sum, order) => sum + order.itemPrice,
          0
        );
        setTotalPrice(calculatedTotalPrice);
      } catch (error) {
        console.error("שגיאה בטעינת נתוני הנעל:", error);
      }
    };

    if (loggedInUser && loggedInUser.userData) {
      fetchShoeData();
    }
  }, []);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    let limitedValue = value;

    if (name === "number") {
      limitedValue = value.replace(/[^0-9]/g, "").slice(0, 16);
    } else if (name === "expiry") {
      let formattedValue = value.replace(/\D/g, "");
      formattedValue = formattedValue.slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
      limitedValue = formattedValue;
    } else if (name === "cvc" && value.length > 3) {
      limitedValue = value.slice(0, 3);
    } else if (name === "name") {
      limitedValue = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 20);
    }

    setState((prev) => ({...prev, [name]: limitedValue }));
    setErrors((prevErrors) => ({...prevErrors, [name]: "" }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({...prev, focus: evt.target.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(state.name)) {
      validationErrors.name = "השם חייב להכיל אותיות בלבד";
    }
    if (!/^\d{16}$/.test(state.number.replace(/\s/g, ""))) {
      validationErrors.number = "מספר הכרטיס חייב להיות 16 ספרות בלבד";
    }
    if (!/^\d{2}\/\d{2}$/.test(state.expiry)) {
      validationErrors.expiry = "תוקף חייב להיות בפורמט MM/YY (4 ספרות)";
    }
    if (!/^\d{3}$/.test(state.cvc)) {
      validationErrors.cvc = "CVC חייב להיות 3 ספרות בלבד";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (!filteredOrders || filteredOrders.length === 0) {
          notify.error("לא נמצאו הזמנות לעדכון.");
          return;
        }
        const userId = loggedInUser.userData.userId
        const ordersToUpdate = filteredOrders.filter(order => order.status === 0);

        if (ordersToUpdate.length === 0) {
          notify.error("לא נמצאו הזמנות לעדכון.");
          return;
        }

        const orderIdsToUpdate = ordersToUpdate.map(order => order.orderId);

        await dataService.updateOrdersStatus(orderIdsToUpdate,userId); // Call the correct function

        alert("התשלום בוצע בהצלחה!");
        setOrderSuccess(true); // עדכון מצב להצלחה
        // Reset form fields
        setState({
          number: "",
          expiry: "",
          cvc: "",
          name: "",
          focus: "",
        });
        setErrors({});

        // Refresh orders and total price
        const refetchedOrders = await dataService.getAllOrdersAndShoesOfUser(loggedInUser.userData.userId);
        setOrdersToPay(refetchedOrders);
        const calculatedTotalPrice = refetchedOrders.reduce((sum, order) => sum + order.itemPrice, 0);
        setTotalPrice(calculatedTotalPrice);
        setTimeout(() => {
          navigate('/navBarUsers'); // ניתוב לאחר השהיה
        }, 2000); // השהיה של 2 שניות (התאם לפי הצורך)

        setOrderSuccess(true);

      } catch (error) {
        console.error("Error during payment:", error);
        notify.error("אירעה שגיאה במהלך התשלום. אנא נסה שוב.");
      }
    }
  };

  if (!ordersToPay) {
    return <div>טוען הזמנות...</div>;
  }

  return (
    <div>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <br />
      <form className="creditCard" onSubmit={handleSubmit}>
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          className="creditCardInput number"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {errors.number && <div className="error">{errors.number}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="creditCardInput name1"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {errors.name && <div className="error">{errors.name}</div>}
        <input
          type="text"
          name="expiry"
          placeholder="Expiry (MM/YY)"
          className="creditCardInput expiry"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {errors.expiry && <div className="error">{errors.expiry}</div>}
        <input
          type="number"
          name="cvc"
          placeholder="CVC"
          className="creditCardInput cvc"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {errors.cvc && <div className="error">{errors.cvc}</div>}
        <button type="submit">בצע הזמנה</button>
      </form>

      {orderSuccess && (
        <div className="success-message">
          <h2>ההזמנה בוצעה בהצלחה!</h2>
          <p>תודה על ההזמנה שלך.</p>
        </div>
      )}
      {ordersToPay && ordersToPay.length > 0 && (
        <div>
          <h3>סה"כ: {totalPrice} ₪</h3>
          <ul>
            {ordersToPay.map(order => (
              <li key={order.orderId}>
                {order.title} - {order.itemPrice} ₪ (כמות: {order.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;