import React, { useState } from "react";
import dataService from "../Service/DataService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import axios, { AxiosError } from "axios";
import CredentialsModel from "../models/CredentialsModel";
import ImagesModel from "../models/ImagesModel";
import appConfig from "../Utils/AppConfig";

export const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isInsideApp = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

    const { data: favorites } = useQuery<ImagesModel[], Error>({
        queryKey: ["favorites"],
        queryFn: dataService.getAllImages,
        select: (data) => data.slice(0, 1),
    });

    const loginMutation = useMutation<any, AxiosError, CredentialsModel>({
        mutationFn: async (credentials: CredentialsModel) => {
            const response = await axios.post(appConfig.loginUrl, credentials);
            return response.data;
        },
        onSuccess: (user: any) => {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("authToken", user.token);
            navigate({ to: `/user/shoesUsers`, search: { userId: user.userData.userId } });
        },
        onError: (error: AxiosError) => {
            console.error("Login Error:", error);
            alert("Login failed. Please check your credentials.");
        },
    });

    const form = useForm({
        defaultValues: { email: "", password: "" },
        onSubmit: async ({ value }) => {
            if (isSubmitting) return;
            setIsSubmitting(true);

            if (value.email === "Admin@gmail.com" && value.password === "123456") {
                localStorage.setItem("authToken", "admin-token");
                localStorage.setItem("user", JSON.stringify({ userData: { role: 'admin' } }));
                navigate({ to: "/admin" });
            } else {
                loginMutation.mutate(value);
            }
            setIsSubmitting(false);
        },
    });

    if (isInsideApp) return null;

    return (
        <div className="login-wrapper">
            <style>{modernLoginStyles}</style>

            <div className="login-container">
                <div className="login-image-side">
                    {favorites && favorites[0] && (
                        <img
                            src={`${appConfig.shoesImagesUsersUrl}${favorites[0].imageName}`}
                            alt="Nike"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://www.shoes-shop-pro.com/api/images/${favorites[0].imageName}`;
                            }}
                        />
                    )}
                    <div className="image-overlay">
                        <h2>JUST DO IT.</h2>
                        <p>Experience the next level of footwear.</p>
                    </div>
                </div>

                <div className="login-form-side">
                    <div className="form-content">
                        <div className="brand-logo">SNKR STORE</div>
                        <h1>Welcome Back</h1>
                        <p className="subtitle">Please enter your details to sign in</p>

                        <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
                            <form.Field name="email">
                                {({ state, handleChange, handleBlur }) => (
                                    <div className="input-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Admin@gmail.com"
                                            value={state.value}
                                            onChange={(e) => handleChange(e.target.value)}
                                            onBlur={handleBlur}
                                            required
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="password">
                                {({ state, handleChange, handleBlur }) => (
                                    <div className="input-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={state.value}
                                            onChange={(e) => handleChange(e.target.value)}
                                            onBlur={handleBlur}
                                            required
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <button type="submit" className="login-main-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Authenticating..." : "Sign In"}
                            </button>

                            <div className="form-footer">
                                <span>New to SNKR?</span>
                                <Link to="/Register">Create an account</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const modernLoginStyles = `
    .login-wrapper { 
        height: 100vh; 
        width: 100vw; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        position: fixed; 
        top: 0; 
        left: 0; 
        z-index: 9999;
        background-color: transparent; 
        backdrop-filter: blur(10px);
        /* ביטול השפעת ה-Zoom של ה-body על המעטפת הזו */
        zoom: 1.25; 
    }

    .login-container { 
        display: flex; 
        width: 1000px; 
        height: 650px; 
        background: #ffffff; 
        border-radius: 40px; 
        box-shadow: 0 30px 100px rgba(0,0,0,0.2); 
        overflow: hidden; 
        margin: auto;
    }

    .login-image-side { 
        flex: 1.1; 
        position: relative; 
        background: #000; 
    }
    
    .login-image-side img { 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
    }

    .login-form-side { 
        flex: 1; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 40px; 
        background: #ffffff; 
    }

    .form-content { 
        width: 100%; 
        max-width: 340px; 
    }

    /* --- עיצוב תיבות הקלט (Inputs) --- */
    .input-group {
        margin-bottom: 20px;
        text-align: left;
    }

    .input-group label {
        display: block;
        font-size: 0.8rem;
        font-weight: 800;
        margin-bottom: 8px;
        color: #111;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .input-group input {
        width: 100%;
        padding: 15px 20px;
        border-radius: 12px;
        border: 2px solid #f0f0f0;
        background-color: #fafafa;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-sizing: border-box; /* חשוב מאוד! */
    }

    .input-group input:focus {
        border-color: #000;
        background-color: #fff;
        outline: none;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    /* --- עיצוב הכפתור הראשי --- */
    .login-main-btn {
        width: 100%;
        padding: 18px;
        background-color: #000;
        color: #fff;
        border: none;
        border-radius: 15px;
        font-size: 1rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
    }

    .login-main-btn:hover {
        background-color: #333;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    .login-main-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    /* עיצוב כותרות וטקסט עזר */
    .brand-logo { font-weight: 900; letter-spacing: 2px; margin-bottom: 10px; font-size: 0.9rem; }
    h1 { font-size: 2.2rem; font-weight: 900; margin: 0 0 10px 0; letter-spacing: -1px; }
    .subtitle { color: #888; margin-bottom: 30px; font-size: 0.9rem; }
    .form-footer { margin-top: 25px; color: #888; font-size: 0.9rem; }
    .form-footer a { color: #000; font-weight: 800; text-decoration: none; margin-left: 5px; }

    @media (max-width: 768px) {
        .login-image-side { display: none; }
        .login-container { border-radius: 0; height: 100vh; width: 100%; }
    }
`;

export default NavBar;