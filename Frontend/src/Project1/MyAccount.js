import React, { useState, useEffect } from "react";
import dataService from "../Service/DataService";

const MyAccount = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateStock, setUpdateStock] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [userData, setUserData] = useState(null);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); // Consider using email instead
  const [userId, setUserId] = useState();

  const handleCheckboxChange = (event) => {
    setUpdateStock(event.target.checked ? 1 : 0);
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    console.log(userString);
    if (userString) {
      try {
        const parsedUserData = JSON.parse(userString);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []); // Run only once on component mount

  // Function to handle setting input values when userData changes
  const handleUserDataChange = () => {
    if (userData) {
      console.log("userData", userData);
      setUserId(userData.userData.userId);
      setFirstName(userData.userData.firstName);
      setLastName(userData.userData.lastName);
      setEmail(userData.userData.email); // Assuming email is used for authentication
      setUpdateStock(userData.userData.updateStock);
    }
  };

  useEffect(() => {
    handleUserDataChange(); // Call on initial render and whenever userData changes
  }, [userData]); // Dependency on userData

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const updatedUserData = {
      userId: userId,
      firstName: firstName, // Assuming these are current state variables
      lastName: lastName,
      email: email,
      updateStock : updateStock
    };

    try {
      await dataService.updateUser(updatedUserData);
      console.log(updatedUserData);
      alert("User account updated successfully."); // Optional success message

      // Update localStorage **after successful update**
      localStorage.setItem("user", JSON.stringify(updatedUserData));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form id="registerForm" onSubmit={handleSubmit}>
      {" "}
      <div className="form-group">
          <label htmlFor="firstName">First Name:</label>{" "}
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          value={firstName} // Set value from state
          onChange={(event) => setFirstName(event.target.value)}
        />
        {" "}
      </div>
      {" "}
      <div className="form-group">
       <label htmlFor="lastName">Last Name:</label>{" "}
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName} // Set value from state
          onChange={(event) => setLastName(event.target.value)}
        />
        {" "}
      </div>
      {" "}
      <div className="form-group">
         <label htmlFor="username">Username (or Email):</label>{" "}
        <input
          type="text" // Change to "email" if using email for authentication
          id="username"
          name="username"
          required
          value={email} // Set value from state
          onChange={(event) => setEmail(event.target.value)}
        />
        {" "}
      </div>
      {" "}
      <div>
        <input
          type="checkbox"
          id="updateStock"
          name="updateStock"
          value={updateStock}
          checked={updateStock === 1}
          onChange={handleCheckboxChange}
        />
        {updateStock === 1 && <p>The value of updateStock is 1</p>}
      </div>
      <div className="form-group">
       <button type="submit">Save</button>{" "}
      </div>
      {" "}
      {errorMessage && <div className="error-message">{errorMessage}</div>}   {" "}
    </form>
  );
};

export default MyAccount;