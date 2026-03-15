// import React, { useState, useMemo } from "react";
// import dataService from "../Service/DataService";
// import ProductsCard from "./ProductsCard";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { AxiosError } from "axios";
// import ShoesModel from "../models/ShoesModel";
// import CategoryShoesModel from "../models/CategoryShoesModel";
// import OrderModel from "../models/OrderModel";
// import UserModel from "../models/UserModel";

// export default function Products() {
//     const queryClient = useQueryClient();
//     const [selectedCategory, setSelectedCategory] = useState<string>("");

//     // --- קריאות API נפרדות ומקביליות באמצעות useQuery (מתוקן)
//     const { data: shoes, isLoading: isShoesLoading, error: shoesError } = useQuery<ShoesModel[], AxiosError>(
//         ["shoes"],
//         dataService.getAllShoes
//     );

//     const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery<CategoryShoesModel[], AxiosError>(
//         ["categories"],
//         dataService.getAllCategories
//     );

//     const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useQuery<OrderModel[], AxiosError>(
//         ["orders"],
//         dataService.getAllOrders
//     );

//     const { data: users, isLoading: isUsersLoading, error: usersError } = useQuery<UserModel[], AxiosError>(
//         ["users"],
//         dataService.getAllUsers
//     );

//     // --- מוטציה לעדכון מוצר (מתוקן)
//     // 💡 תיקון: הגדרת סוג הנתונים הצפוי גם עבור null
//     const updateProductMutation = useMutation<ShoesModel | null, AxiosError, ShoesModel>(
//         (updatedProduct) => dataService.updateProduct(updatedProduct),
//         {
//             onSuccess: (data) => {
//                 // 💡 בדיקה אם הנתונים שהתקבלו אינם null
//                 if (data) {
//                     alert("Product updated successfully.");
//                 } else {
//                     alert("Product update failed.");
//                 }
//                 queryClient.invalidateQueries({ queryKey: ["shoes"] });
//             },
//             onError: (err) => {
//                 alert(`Error updating product: ${err.message}`);
//             },
//         }
//     );

//     // --- פונקציות עיבוד וחישוב ---
//     const filteredShoes = useMemo<ShoesModel[]>(() => {
//         if (!shoes) return [];
//         if (!selectedCategory) return shoes;
//         const numericCategoryId = Number(selectedCategory);
//         return shoes.filter((shoe) => Number(shoe.categoryId) === numericCategoryId);
//     }, [shoes, selectedCategory]);

//     const totalStock = useMemo<number>(() => {
//         return filteredShoes.length;
//     }, [filteredShoes]);
    
//     const selectedCategoryName = useMemo<string>(() => {
//         if (!selectedCategory || !categories) return "All Categories";
//         const foundCategory = categories.find((category) => category.categoryId.toString() === selectedCategory);
//         return foundCategory?.categoryName || "All Categories";
//     }, [selectedCategory, categories]);

//     // --- פונקציות לשינוי מצב ממשק ---
//     const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedCategory(event.target.value);
//     };
    
//     const updateProduct = (updatedProduct: ShoesModel) => {
//         updateProductMutation.mutate(updatedProduct);
//     };

//     // --- הצגת רכיבים ותנאים ---
//     const isLoading = isShoesLoading || isCategoriesLoading || isOrdersLoading || isUsersLoading;
//     const hasError = shoesError || categoriesError || ordersError || usersError;

//     if (isLoading) {
//         return <div className="loading-message">Loading data...</div>;
//     }

//     if (hasError) {
//         return <div className="error-message">Error fetching data.</div>;
//     }

//     return (
//         <div>
//             <div className="center-select">
//                 <select value={selectedCategory} onChange={handleCategoryChange}>
//                     <option value="">Choose category</option>
//                     {categories?.map((category) => (
//                         <option key={category.categoryId} value={category.categoryId}>
//                             {category.categoryName}
//                         </option>
//                     ))}
//                 </select>
//                 <p className="total-stock">
//                     Total Shoes in Stock for {selectedCategoryName}: {totalStock}
//                 </p>
//             </div>
//             <br />
//             <ProductsCard
//                 shoes={filteredShoes}
//                 categories={categories}
//                 orders={orders}
//                 users={users}
//                 onProductUpdated={updateProduct}
//             />
//             <div className="center-button">
//                 <Link to="/shoes/new">➕</Link>
//             </div>
//         </div>
//     );
// }