import React from "react";
import dataService from "../Service/DataService";
import appConfig from "../Utils/AppConfig";
import axios, { AxiosError } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import UserModel from "../models/UserModel";
import { useNavigate, Link } from "@tanstack/react-router";

type RegisterPayload = Partial<UserModel> & { updateStock?: number };

const Register = () => {
    const navigate = useNavigate();

    const { data: favorites, isLoading: isFavoritesLoading } = useQuery({ 
        queryKey: ["favorites"], 
        queryFn: dataService.getAllImages 
    });

    const registerMutation = useMutation<UserModel, AxiosError, RegisterPayload>({
        mutationFn: async (userData: RegisterPayload) => {
            const finalData = { ...userData, updateStock: 0 };
            const response = await axios.post(appConfig.registerUrl, finalData);
            return response.data;
        },
        onSuccess: () => {
            alert("Success! Welcome to SNKR STORE.");
            navigate({ to: `/` });
        },
        onError: (error: any) => {
            alert("Registration Failed: " + (error.response?.data || "Check Server Logs"));
        },
    });

    const form = useForm({
        defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
        onSubmit: async ({ value }) => {
            if (value.password !== value.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            await registerMutation.mutateAsync({
                firstName: value.firstName,
                lastName: value.lastName,
                email: value.email,
                password: value.password,
            });
        },
    });

    if (isFavoritesLoading) return <div className="loading-screen">INITIALIZING NIKE...</div>;

    return (
        <div className="register-wrapper">
            <style>{modernRegisterStyles}</style>
            <div className="register-container">
                <div className="register-image-side">
                    {favorites?.[1] && (
                        <img src={appConfig.shoesImagesUsersUrl + favorites[1].imageName} alt="Nike" />
                    )}
                    {/* <div className="image-overlay">
                        <h2>NIKE MEMBERSHIP</h2>
                        <p>Become part of the most exclusive sneaker community.</p>
                    </div> */}
                </div>

                <div className="register-form-side">
                    <div className="form-content">
                        <div className="brand-logo">SNKR STORE</div>
                        <h1>Become a Member</h1>
                        <p className="subtitle">Sign up for first access to the latest drops.</p>

                        <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
                            {[
                                { name: "firstName", label: "First Name", type: "text" },
                                { name: "lastName", label: "Last Name", type: "text" },
                                { name: "email", label: "Email Address", type: "email" },
                                { name: "password", label: "Password", type: "password" },
                                { name: "confirmPassword", label: "Confirm Password", type: "password" }
                            ].map((input) => (
                                <form.Field key={input.name} name={input.name as any}>
                                    {(field) => (
                                        <div className="input-group">
                                            <label>{input.label}</label>
                                            <input 
                                                type={input.type}
                                                value={field.state.value} 
                                                onChange={(e) => field.handleChange(e.target.value)} 
                                                placeholder={input.label} 
                                            />
                                        </div>
                                    )}
                                </form.Field>
                            ))}

                            <button type="submit" className="register-main-btn" disabled={registerMutation.isPending}>
                                {registerMutation.isPending ? "CREATING..." : "JOIN NOW"}
                            </button>

                            <div className="form-footer">
                                <span>Member already?</span> <Link to="/">Sign In</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const modernRegisterStyles = `
    .register-wrapper { 
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh; 
        width: 100vw; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 9999;
        background-color: rgba(191, 222, 221, 0.4); 
        backdrop-filter: blur(10px);
        zoom: 1.25; 
    }

    .register-container { 
        display: flex; 
        width: 1000px; 
        /* שינוי כאן: גובה גמיש כדי שלא ייחתך */
        min-height: 650px; 
        height: auto; 
        background: #fff; 
        border-radius: 40px; 
        overflow: hidden; 
        box-shadow: 0 40px 100px rgba(0,0,0,0.2); 
        margin: 20px auto;
    }

    .register-image-side { 
        flex: 1.1; 
        position: relative; 
        background: #000;
        /* מבטיח שהתמונה תימתח לאורך כל הטופס הגמיש */
        display: flex;
    }
    
    .register-image-side img { 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
    }
    
    .register-form-side { 
        flex: 1; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 40px; 
        background: #fff; 
    }

    .form-content { 
        width: 100%; 
        max-width: 320px; 
        /* הוספת מרווח קטן בסוף כדי שהכפתור והלינק לא ייצמדו לקצה */
        padding-bottom: 20px; 
    }
    
    .input-group { margin-bottom: 12px; }
    .input-group label { display: block; font-size: 0.7rem; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; }
    .input-group input { 
        width: 100%; 
        padding: 10px 15px; 
        border-radius: 10px; 
        border: 1px solid #eee; 
        background: #fafafa;
        font-size: 0.9rem; 
        box-sizing: border-box; 
    }

    .register-main-btn { 
        width: 100%; 
        padding: 16px; 
        background: #000; 
        color: #fff; 
        border: none; 
        border-radius: 12px; 
        font-weight: 800; 
        cursor: pointer; 
        margin-top: 15px; 
    }

    .form-footer { margin-top: 15px; text-align: center; color: #666; font-size: 0.85rem; }
`;

export default Register;