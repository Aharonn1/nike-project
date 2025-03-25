import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const adminEmail = "Admin@gmail.com";
            const adminPassword = "123456";
            if (email === adminEmail && password === adminPassword) {
                navigate("/navBarAdmin");
            } else {
                try {
                    const response = await axios.post(
                        "http://localhost:4022/api/auth/login",
                        { email, password }
                    );
                    console.log("Server Response:", response.config.data);
                    console.log(response);

                    const user = response.data;
                    console.log("user", user);

                    const token = response.data.token;
                    console.log("token", token);
                    if (user && token) {
                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("authToken", token);
                        const userId = user.userData.userId;
                        console.log(userId);
                        navigate("/navBarUsers", { state: { userId } });
                        setUserId(userId);
                    }
                } catch (error) {
                    console.error("Login Error:", error);
                    setErrorMessage("Login failed. Please try again.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
      <div style={{
        display: "flex",
        justifyContent: "top",
        alignItems: "top",
        height: "97vh",
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
                                height: "97vh",
                                objectFit: "cover",
                            }}
                        />
                        {index === 0 && (
                            <form
                                id="registerForm"
                                onSubmit={handleSubmit}
                                style={{
                                    margin: "20px 20px",
                                    height: "33.33vh",
                                }}
                            >
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit">Login</button>
                                </div>
                                {errorMessage && (
                                    <div className="error-message">{errorMessage}</div>
                                )}
                                <div className="form-group">
                                    <a href="#">Forgot Password?</a>
                                </div>
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

export default Login;