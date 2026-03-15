import { useState, FC } from "react";
import dataService from "../Service/DataService";
import { useMutation } from "@tanstack/react-query";
import CategoryShoesModel from "../models/CategoryShoesModel";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

interface CategoriesCardProps {
    category: CategoryShoesModel;
    onCategoryDeleted: (categoryId: number) => void;
}

const CategoriesCard: FC<CategoriesCardProps> = (props) => {
    const [categoryName, setCategoryName] = useState<string>(props.category.categoryName);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const updateMutation = useMutation<any, Error, CategoryShoesModel>({
        mutationFn: (updatedCategory) => dataService.updateCategory(updatedCategory),
        onSuccess: () => {
            alert("Updated!");
            setIsEditing(false);
        },
    });

    const handleUpdate = () => {
        updateMutation.mutate({ ...props.category, categoryName });
    };

    return (
        <div className="luxury-card">
            <style>{cardStyles}</style>
            
            <div className="card-icon">🏷️</div>

            {isEditing ? (
                <div className="edit-mode">
                    <input 
                        type="text" 
                        value={categoryName} 
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="edit-input"
                    />
                    <div className="action-btns">
                        <button onClick={handleUpdate} className="save-btn"><FaCheck /></button>
                        <button onClick={() => setIsEditing(false)} className="cancel-btn"><FaTimes /></button>
                    </div>
                </div>
            ) : (
                <div className="display-mode">
                    <h3 className="category-name">{categoryName}</h3>
                    <div className="action-btns">
                        <button onClick={() => setIsEditing(true)} className="edit-btn"><FaEdit /></button>
                        <button onClick={() => props.onCategoryDeleted(props.category.categoryId)} className="delete-btn"><FaTrash /></button>
                    </div>
                </div>
            )}
        </div>
    );
}

const cardStyles = `
    .luxury-card { 
        background: #fff; padding: 30px; border-radius: 25px; text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid #f0f0f0; position: relative; overflow: hidden;
    }
    .luxury-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: #000; }
    .card-icon { font-size: 2.5rem; margin-bottom: 15px; opacity: 0.8; }
    .category-name { font-size: 1.4rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; color: #111; }
    
    .action-btns { display: flex; justify-content: center; gap: 12px; }
    .action-btns button { 
        border: none; width: 45px; height: 45px; border-radius: 12px; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s;
    }
    
    .edit-btn { background: #f4f4f4; color: #111; }
    .edit-btn:hover { background: #000; color: #fff; }
    
    .delete-btn { background: #fff1f1; color: #ff4757; }
    .delete-btn:hover { background: #ff4757; color: #fff; }
    
    .save-btn { background: #000; color: #fff; }
    .cancel-btn { background: #eee; color: #666; }
    
    .edit-input { 
        width: 100%; padding: 12px; border-radius: 10px; border: 2px solid #000; 
        margin-bottom: 15px; font-weight: 700; text-align: center;
    }
`;

export default CategoriesCard;