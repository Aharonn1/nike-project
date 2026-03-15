import React from "react";
import dataService from "../Service/DataService";
import CategoriesCard from "./CategoriesCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CategoryShoesModel from "../models/CategoryShoesModel";
import { Link } from "@tanstack/react-router";
import { FaPlus } from "react-icons/fa";

export default function Categories() {
    const queryClient = useQueryClient();

    const { data: categories, isLoading, isError, error } = useQuery<CategoryShoesModel[], Error>({
        queryKey: ['categories'],
        queryFn: dataService.getAllCategories,
    });

    const deleteCategoryMutation = useMutation<void, Error, number>({
        mutationFn: (categoryId: number) => dataService.deleteCategory(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    if (isLoading) return <div style={statusStyle}>Loading Luxury Categories...</div>;
    if (isError) return <div style={statusStyle}>Error: {error.message}</div>;

    return (
        <div style={containerStyle}>
            <style>{pageStyles}</style>
            <h1 className="page-title">Category Management</h1>
            
            <div className="categories-grid">
                {categories?.map((category) => (
                    <CategoriesCard
                        key={category.categoryId}
                        category={category}
                        onCategoryDeleted={() => deleteCategoryMutation.mutate(category.categoryId)}
                    />
                ))}
                
                {/* כרטיס הוספה חדש */}
                <Link to="/admin/categoryshoes/new" className="add-category-card">
                    <FaPlus size={30} />
                    <span>Add Category</span>
                </Link>
            </div>
        </div>
    );
}

const statusStyle: React.CSSProperties = { textAlign: 'center', padding: '100px', fontSize: '1.5rem', fontWeight: 900 };
const containerStyle: React.CSSProperties = { padding: "40px 5%", minHeight: "100vh", backgroundColor: "#f9f9f9" };

const pageStyles = `
    .page-title { font-size: 3rem; font-weight: 950; text-align: center; text-transform: uppercase; letter-spacing: -2px; margin-bottom: 50px; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
    .add-category-card { 
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: #fff; border: 3px dashed #ddd; border-radius: 20px; cursor: pointer;
        transition: 0.3s; min-height: 200px; text-decoration: none; color: #aaa;
    }
    .add-category-card:hover { border-color: #000; color: #000; transform: translateY(-5px); }
`;