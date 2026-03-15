import React, { useMemo } from "react";
import dataService from "../Service/DataService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import UserModel from "../models/UserModel";
import { FaUser, FaEnvelope, FaShieldAlt, FaSave } from "react-icons/fa";

interface UserDataFromLocalStorage {
    userData: UserModel;
}

const fetchUserDataFromLocalStorage = async (): Promise<UserModel | null> => {
    const userString = localStorage.getItem("user");
    if (userString) {
        try {
            const parsedUserData: UserDataFromLocalStorage = JSON.parse(userString);
            return parsedUserData.userData;
        } catch (error) {
            throw new Error("Failed to parse user data.");
        }
    }
    return null;
};

const MyAccount = () => {
    const queryClient = useQueryClient();

    const { data: userData, isLoading, isError, error } = useQuery<UserModel | null, Error>({
        queryKey: ["userData"],
        queryFn: fetchUserDataFromLocalStorage,
    });

    const updateUserMutation = useMutation<any, Error, UserModel>({
        mutationFn: async (updatedData: UserModel) => {
            const existingUserString = localStorage.getItem("user");
            if (!existingUserString) throw new Error("No user found.");
            const existingUser: UserDataFromLocalStorage = JSON.parse(existingUserString);
            const updatedUser = { ...existingUser, userData: { ...existingUser.userData, ...updatedData } };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            await dataService.updateUser(updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userData"] });
            alert("Account details updated! 🚀");
        },
    });

    const form = useForm({
        defaultValues: useMemo(() => ({
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
            email: userData?.email || "",
            updateStock: userData?.updateStock === 1,
        }), [userData]),
        onSubmit: async ({ value }) => {
            if (!userData) return;
            const updatedUserData: UserModel = {
                ...userData,
                firstName: value.firstName,
                lastName: value.lastName,
                email: value.email,
                updateStock: value.updateStock ? 1 : 0,
            };
            await updateUserMutation.mutateAsync(updatedUserData);
        },
    });

    if (isLoading) return <div style={centerMsg}>Setting up your profile...</div>;

    return (
        <div style={containerStyle}>
            <style>{globalStyles}</style>
            <div style={glassCardStyle}>
                <div style={headerStyle}>
                    <div style={avatarStyle}>{userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}</div>
                    <h2 style={titleStyle}>Profile Settings</h2>
                    <p style={subtitleStyle}>Manage your personal information</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit(); }} style={formStyle}>
                    
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaUser style={iconStyle}/> First Name</label>
                        <form.Field name="firstName">
                            {({ state, handleChange }) => (
                                <input style={inputStyle} type="text" value={state.value} onChange={(e) => handleChange(e.target.value)} placeholder="Enter first name" />
                            )}
                        </form.Field>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaUser style={iconStyle}/> Last Name</label>
                        <form.Field name="lastName">
                            {({ state, handleChange }) => (
                                <input style={inputStyle} type="text" value={state.value} onChange={(e) => handleChange(e.target.value)} placeholder="Enter last name" />
                            )}
                        </form.Field>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaEnvelope style={iconStyle}/> Email Address</label>
                        <form.Field name="email">
                            {({ state, handleChange }) => (
                                <input style={inputStyle} type="email" value={state.value} onChange={(e) => handleChange(e.target.value)} placeholder="email@example.com" />
                            )}
                        </form.Field>
                    </div>

                    <div style={checkboxWrapperStyle}>
                        <form.Field name="updateStock">
                            {({ state, handleChange }) => (
                                <label style={customCheckboxStyle}>
                                    <input type="checkbox" checked={state.value} onChange={(e) => handleChange(e.target.checked)} />
                                    <span style={checkboxLabelStyle}>🔔 Notify me on stock updates</span>
                                </label>
                            )}
                        </form.Field>
                    </div>

                    <button type="submit" disabled={updateUserMutation.isPending} style={saveButtonStyle}>
                        {updateUserMutation.isPending ? "Updating..." : <><FaSave style={{marginRight:'8px'}}/> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

/* --- Luxury Styles --- */

const globalStyles = `
    input:focus { border-color: #000 !important; outline: none; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }
    input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: #000; }
`;

const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "20px"
};

const glassCardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "30px",
    padding: "50px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255,255,255,0.3)"
};

const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "40px"
};

const avatarStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "1px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
};

const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "900",
    color: "#111",
    margin: 0
};

const subtitleStyle: React.CSSProperties = {
    color: "#777",
    fontSize: "14px",
    marginTop: "5px"
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
};

const inputGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "800",
    color: "#333",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center"
};

const iconStyle: React.CSSProperties = {
    marginRight: "8px",
    fontSize: "14px",
    color: "#111"
};

const inputStyle: React.CSSProperties = {
    padding: "15px 20px",
    borderRadius: "15px",
    border: "2px solid #f0f0f0",
    fontSize: "16px",
    backgroundColor: "#fff",
    transition: "0.3s"
};

const checkboxWrapperStyle: React.CSSProperties = {
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    borderTop: "1px solid #eee"
};

const customCheckboxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer"
};

const checkboxLabelStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#444"
};

const saveButtonStyle: React.CSSProperties = {
    padding: "18px",
    borderRadius: "50px",
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    marginTop: "10px"
};

const centerMsg: React.CSSProperties = { textAlign: "center", padding: "100px", fontSize: "18px", fontWeight: "700" };

export default MyAccount;