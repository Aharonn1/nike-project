import UsersCard, { OrderWithDetails } from "./UsersCard";
import dataService from "../Service/DataService";
import { useQuery } from "@tanstack/react-query";
import UserModel from "../models/UserModel"; // ✅ ייבוא הטיפוס UserModel כי ה-queryFn עדיין מחזיר אותו
import { AxiosError } from "axios";

export default function Products() {
    // ✅ תיקון: שימוש ב-select כדי להתאים את הטיפוסים
    const { data: usersWithOrders, isLoading, error } = useQuery<UserModel[], AxiosError, OrderWithDetails[]>({
        queryKey: ["usersWithOrders"],
        queryFn: dataService.getAllUsers,
        select: (users) => {
            // ✅ טרנספורמציה: אנחנו אומרים ל-TypeScript שהנתונים תואמים
            // ושהם בעצם מסוג OrderWithDetails[]
            return users as unknown as OrderWithDetails[];
        }
        
    });

    if (isLoading) {
        return <div className="loading-message">Loading data...</div>;
    }

    if (error) {
        return <div className="error-message">Error fetching data.</div>;
    }

    return (
        <div>
            <UsersCard users={usersWithOrders} />
        </div>
    );
}