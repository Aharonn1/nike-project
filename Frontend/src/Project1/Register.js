import React, { useState,useEffect } from "react";
import axios from "axios"; // Assuming you're using Axios for API calls
import { useNavigate } from "react-router-dom";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); // Consider using email instead
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); // Get the navigate function
  const [updateStock, setUpdateStock] = useState(0);
  const [favorites, setFavorites] = useState();

  useEffect(() => {
      const fetchFavorites = async () => {
          try {
              const userFavorites = await dataService.getAllImages();
              console.log("userFavorites", userFavorites);
              setFavorites(userFavorites);
          } catch (error) {
              console.error("שגיאה בטעינת ה-favorites:", error);
          }
      };

      fetchFavorites();
  },[]);



  const handleCheckboxChange = (event) => {
    setUpdateStock(event.target.checked ? 1 : 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4022/api/auth/register",
        {
          firstName,
          lastName,
          email, // Or email if you're using email for authentication
          password,
          updateStock,
        }
      );
      console.log(response); // Log the response for debugging

      alert("Registration successful!"); // Simple example
      navigate("/navBarUsers");
    } catch (error) {
      console.error(error); // Log the error for debugging
      setErrorMessage(error.response?.data?.message || "Registration failed."); // Extract error message from response or use generic message
    }
    console.log("הערך של updateStock:", updateStock);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
  }}>
      {favorites && favorites.length > 0 ? (
          <>
              {favorites.map((image, index) => (
                  <React.Fragment key={image.imageId}>
                      <img
                          src={appConfig.shoesImagesUsersUrl + image.imageName}
                          alt={`Image ${image.imageId}`}
                          style={{
                              width: "33.33%",
                              height: "100vh",
                              objectFit: "cover",
                          }}
                      />
                      {index === 0 && (
                          <form id="registerForm" onSubmit={handleSubmit}>
                              <div className="form-group">
                                  <label htmlFor="firstName">First Name:</label>
                                  <input type="text" id="firstName" name="firstName" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="lastName">Last Name:</label>
                                  <input type="text" id="lastName" name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="username">Username (or Email):</label>
                                  <input type="text" id="username" name="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="password">Password:</label>
                                  <input type="password" id="password" name="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="confirmPassword">Confirm Password:</label>
                                  <input type="password" id="confirmPassword" name="confirmPassword" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                              </div>
                              <div>
                                  <input type="checkbox" id="updateStock" name="updateStock" value={updateStock} checked={updateStock === 1} onChange={handleCheckboxChange} />
                                  {updateStock === 1 && <p>הערך של updateStock הוא 1!</p>}
                              </div>
                              <div className="form-group">
                                  <button type="submit">Register</button>
                              </div>
                              {errorMessage && <div className="error-message">{errorMessage}</div>}
                          </form>
                      )}
                  </React.Fragment>
              ))}
          </>
      ) : (
          <p>אין תמונות מועדפות להצגה.</p>
      )}
  </div>
  );
};

export default Register;
