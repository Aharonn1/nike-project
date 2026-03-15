import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dataService from "../Service/DataService";
import UserModel from "../models/UserModel";
import RoleModel from "../models/RoleModel"; // 🎯 ייבוא ה-Enum לשימוש בהשוואה
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUserShield } from "react-icons/fa";

function AdminUsers() {
    const queryClient = useQueryClient();
    const [editedUser, setEditedUser] = useState<UserModel | null>(null);
    const [updateMessage, setUpdateMessage] = useState<string>("");

    const { data: users, isLoading } = useQuery<UserModel[], Error>({
        queryKey: ['users', 'admin'],
        queryFn: dataService.getAllUsersForAdmin,
    });

    const deleteUserMutation = useMutation<any, Error, number>({
        mutationFn: dataService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
            alert("User removed.");
        },
    });

    const updateUserMutation = useMutation<any, Error, UserModel>({
        mutationFn: dataService.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setUpdateMessage("Updated successfully!");
            setEditedUser(null);
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div className="admin-page-wrapper">
            <style>{adminStyles}</style>
            
            {/* 🎯 התיקון לעיצוב: הכותרת והמונה צמודים באמצע המסך */}
            <header className="centered-admin-header">
                <div className="header-content-box">
                    <FaUserShield size={35} />
                    <h1>USER MANAGEMENT</h1>
                    <div className="total-badge">Total Users: {users?.length || 0}</div>
                </div>
            </header>

            {isLoading ? (
                <div className="loader">FETCHING DATABASE...</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>FIRST NAME</th>
                                <th>LAST NAME</th>
                                <th>EMAIL</th>
                                <th>ROLE</th>
                                <th style={{ textAlign: "center" }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user, index) => (
                                <tr key={user.userId} className={editedUser?.userId === user.userId ? "editing-row" : ""}>
                                    <td>{index + 1}</td>
                                    <td><span className="id-badge">{user.userId}</span></td>
                                    
                                    {editedUser?.userId === user.userId ? (
                                        <>
                                            <td><input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} className="edit-input" /></td>
                                            <td><input type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange} className="edit-input" /></td>
                                            <td><input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="edit-input" /></td>
                                            <td><input type="text" name="role" value={editedUser.role} onChange={handleInputChange} className="edit-input" /></td>
                                            <td className="actions-cell">
                                                <button onClick={() => updateUserMutation.mutate(editedUser)} className="btn-save"><FaCheck /></button>
                                                <button onClick={() => setEditedUser(null)} className="btn-cancel"><FaTimes /></button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="bold-text">{user.firstName}</td>
                                            <td className="bold-text">{user.lastName}</td>
                                            <td className="email-text">{user.email}</td>
                                            <td>
                                                {/* 🎯 התיקון לשגיאת ה-TypeScript: שימוש ב-Enum במקום מחרוזת */}
                                                <span className={`role-tag ${user.role === RoleModel.Admin ? 'admin' : 'user'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button onClick={() => setEditedUser({ ...user })} className="btn-edit"><FaEdit /></button>
                                                <button onClick={() => deleteUserMutation.mutate(user.userId)} className="btn-delete"><FaTrash /></button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const adminStyles = `
    .admin-page-wrapper { padding: 40px 2%; background-color: #fafafa; min-height: 100vh; font-family: 'Inter', sans-serif; }
    
    .centered-admin-header {
        display: flex;
        justify-content: center;
        margin-bottom: 50px;
    }
    .header-content-box {
        display: flex;
        align-items: center;
        gap: 15px;
        background: #000;
        color: #fff;
        padding: 15px 40px;
        border-radius: 100px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    .header-content-box h1 { font-size: 1.8rem; font-weight: 950; margin: 0; letter-spacing: -1px; }
    .total-badge { background: #333; padding: 6px 15px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; }

    .table-container { width: 100%; background: #fff; border-radius: 25px; box-shadow: 0 20px 60px rgba(0,0,0,0.05); overflow: hidden; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { background: #000; color: #fff; padding: 20px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; text-align: left; }
    
    /* 🎯 אפקט ריחוף משודרג - בולט וחזק יותר */
    .admin-table tbody tr {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
    }

    .admin-table tbody tr:hover {
        background-color: #ffffff !important;
        /* גורם לשורה להיראות כאילו היא צפה */
        transform: translateY(-2px) scale(1.005); 
        box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        z-index: 10;
    }

    /* פס שחור עבה יותר בצד בזמן ריחוף */
    .admin-table tbody tr:hover td:first-child {
        box-shadow: inset 8px 0 0 0 #000;
    }

    .admin-table td { padding: 20px; border-bottom: 1px solid #f0f0f0; font-size: 1rem; color: #333; transition: 0.3s; }
    
    /* הופך את הטקסט למודגש יותר כשעומדים על השורה */
    .admin-table tr:hover td {
        color: #000;
    }

    .id-badge { background: #eee; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; }
    .bold-text { font-weight: 700; color: #000; }
    .role-tag { padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; }
    .role-tag.admin { background: #000; color: #fff; }
    .role-tag.user { background: #f0f0f0; color: #888; }

    .actions-cell { display: flex; gap: 10px; justify-content: center; }
    .actions-cell button { border: none; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .btn-edit { background: #f4f4f4; color: #000; }
    .btn-delete { background: #fff1f1; color: #ff4757; }
    .btn-edit:hover { background: #000; color: #fff; transform: translateY(-2px); }
    .btn-delete:hover { background: #ff4757; color: #fff; transform: translateY(-2px); }
    .edit-input { width: 100%; padding: 8px; border: 2px solid #000; border-radius: 6px; font-weight: 600; }
`;

export default AdminUsers;