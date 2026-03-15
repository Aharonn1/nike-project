import React from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dataService from "../Service/DataService";
import CategoryShoesModel from "../models/CategoryShoesModel";
import { useNavigate } from "@tanstack/react-router";

function AddCategory() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const createCategoryMutation = useMutation({
        mutationFn: (category: Omit<CategoryShoesModel, 'categoryId'>) =>
            dataService.createCategory(category as CategoryShoesModel),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoryshoes"] });
            // navigate("/categoryshoes");
            alert("Category added successfully!");
        },
        onError: (err: Error) => {
            alert(`Error: ${err.message}`);
        },
    });

    const form = useForm({
        defaultValues: {
            categoryName: "",
            sale: "",
        },
        onSubmit: async ({ value }) => {
            try {
                const categoryToCreate = {
                    categoryName: value.categoryName,
                    sale: Number(value.sale),
                };
                await createCategoryMutation.mutateAsync(categoryToCreate);
            } catch (err) {
                console.error("Failed to add category:", err);
            }
        },
    });

    return (
        <div className="AddCategory Box">
            <h1>Add Category</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                {/* TanStack Form: ניהול שדה "categoryName" */}
                <form.Field
                    name="categoryName"
                    validators={{
                        onChange: ({ value }) => !value ? "Category name is required" : undefined,
                    }}
                >
                    {({ state, handleChange, handleBlur, name }) => (
                        <>
                            <label htmlFor={name}>Category Name</label>
                            <input
                                id={name}
                                type="text"
                                value={state.value as string}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                            />
                            {state.meta.errors.length > 0 && (
                                <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
                            )}
                        </>
                    )}
                </form.Field>

                {/* TanStack Form: ניהול שדה "sale" */}
                <form.Field
                    name="sale"
                    validators={{
                        onChange: ({ value }) =>
                            value === "" || isNaN(Number(value)) ? "Sale value must be a number" : undefined,
                    }}
                >
                    {({ state, handleChange, handleBlur, name }) => (
                        <>
                            <label htmlFor={name}>Sale:</label>
                            <input
                                id={name}
                                type="text"
                                value={state.value as string}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                            />
                            {state.meta.errors.length > 0 && (
                                <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
                            )}
                        </>
                    )}
                </form.Field>

                {createCategoryMutation.isPending && <p>Adding category...</p>}
                {createCategoryMutation.isError && (
                    <p style={{ color: "red" }}>
                        An error occurred: {createCategoryMutation.error.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={createCategoryMutation.isPending || form.state.isSubmitting}
                >
                    Add
                </button>
            </form>
        </div>
    );
}

export default AddCategory;