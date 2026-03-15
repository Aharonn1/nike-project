// import React from "react";
// import { useForm, FieldApi } from "@tanstack/react-form";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import dataService from "../Service/DataService";
// import CategoryShoesModel from "../models/CategoryShoesModel";

// // סוג נתונים עבור הטופס, שהוא שונה מהמודל הסופי
// // כי הוא כולל את הקובץ שנבחר
// interface AddShoeFormState {
//     categoryId: number | "";
//     description: string;
//     price: number;
//     title: string;
//     bought: number;
//     stock: number;
//     imageLink: string;
//     image: FileList | null;
// }

// function AddShoe() {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     // --- useQuery: טעינת רשימת הקטגוריות
//     const {
//         data: categories,
//         isLoading,
//         isError,
//         error,
//     } = useQuery<CategoryShoesModel[], Error>({
//         queryKey: ["categories"],
//         queryFn: dataService.getAllCategories,
//     });

//     // --- useMutation: שליחת נעל חדשה
//     const addShoeMutation = useMutation({
//         mutationFn: async (newShoe: AddShoeFormState) => {
//             const formData = new FormData();
//             formData.append(
//                 "shoeData",
//                 JSON.stringify({
//                     categoryId: Number(newShoe.categoryId),
//                     description: newShoe.description,
//                     price: newShoe.price,
//                     title: newShoe.title,
//                     bought: newShoe.bought,
//                     stock: newShoe.stock,
//                     imageLink: newShoe.imageLink,
//                 })
//             );

//             if (newShoe.image && newShoe.image.length > 0) {
//                 formData.append("image", newShoe.image[0]);
//             }

//             const response = await dataService.addShoe(formData);
//             return response;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["shoes"] });
//             navigate("/shoes");
//             alert("Shoe added successfully!");
//         },
//         onError: (err: Error) => {
//             console.error("Error adding shoe:", err);
//             alert(`Failed to add shoe: ${err.message}`);
//         },
//     });

//     // --- TanStack Form: הגדרת הטופס והשדות
//     const form = useForm<AddShoeFormState>({
//         defaultValues: {
//             categoryId: "",
//             description: "",
//             price: 0,
//             title: "",
//             bought: 0,
//             stock: 0,
//             imageLink: "",
//             image: null,
//         },
//         onSubmit: async ({ value }) => {
//             await addShoeMutation.mutateAsync(value);
//             form.reset();
//         },
//     });

//     // --- טיפול במצבי טעינה ושגיאה של הקטגוריות
//     if (isLoading) {
//         return <div>טוען קטגוריות...</div>;
//     }
//     if (isError) {
//         return <div>שגיאה בטעינת קטגוריות: {error.message}</div>;
//     }

//     return (
//         <div className="AddShoeBox">
//             <h1>Add Shoe</h1>
//             <form
//                 onSubmit={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     void form.handleSubmit();
//                 }}
//             >
//                 {/* TanStack Form: ניהול שדה "categoryId" */}
//                 <form.Field name="categoryId"
//                     validators={{
//                         onChange: ({ value }) => !value ? "Category is required" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Category:</label>
//                             <select
//                                 id={name}
//                                 value={state.value}
//                                 onChange={(e) => handleChange(e.target.value)}
//                                 onBlur={handleBlur}
//                             >
//                                 <option value="">Select a category</option>
//                                 {categories?.map((category) => (
//                                     <option key={category.categoryId} value={category.categoryId}>
//                                         {category.categoryName}
//                                     </option>
//                                 ))}
//                             </select>
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>

//                 {/* TanStack Form: ניהול שאר השדות */}
//                 <form.Field name="description"
//                     validators={{
//                         onChange: ({ value }) => !value ? "Description is required" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Description:</label>
//                             <input
//                                 id={name}
//                                 type="text"
//                                 value={state.value as string}
//                                 onChange={(e) => handleChange(e.target.value)}
//                                 onBlur={handleBlur}
//                             />
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>
                
//                 {/* כאן יתווספו שדות נוספים */}
//                 {/* ...price, title, bought, stock, imageLink, image... */}
//                 {/* TanStack Form: ניהול שדה "price" */}
//                 <form.Field name="price"
//                     validators={{
//                         onChange: ({ value }) => (typeof value !== 'number' || isNaN(value) || value <= 0) ? "Price must be a positive number" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Price:</label>
//                             <input
//                                 id={name}
//                                 type="number"
//                                 value={state.value}
//                                 onChange={(e) => handleChange(Number(e.target.value))}
//                                 onBlur={handleBlur}
//                             />
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>

//                 {/* TanStack Form: ניהול שדה "title" */}
//                 <form.Field name="title"
//                     validators={{
//                         onChange: ({ value }) => !value ? "Title is required" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Title:</label>
//                             <input
//                                 id={name}
//                                 type="text"
//                                 value={state.value as string}
//                                 onChange={(e) => handleChange(e.target.value)}
//                                 onBlur={handleBlur}
//                             />
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>

//                 {/* TanStack Form: ניהול שדה "bought" */}
//                 <form.Field name="bought"
//                     validators={{
//                         onChange: ({ value }) => (typeof value !== 'number' || isNaN(value) || value < 0) ? "Bought quantity must be a non-negative number" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Bought:</label>
//                             <input
//                                 id={name}
//                                 type="number"
//                                 value={state.value}
//                                 onChange={(e) => handleChange(Number(e.target.value))}
//                                 onBlur={handleBlur}
//                             />
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>
                
//                 {/* TanStack Form: ניהול שדה "stock" */}
//                 <form.Field name="stock"
//                     validators={{
//                         onChange: ({ value }) => (typeof value !== 'number' || isNaN(value) || value < 0) ? "Stock must be a non-negative number" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Stock:</label>
//                             <input
//                                 id={name}
//                                 type="number"
//                                 value={state.value}
//                                 onChange={(e) => handleChange(Number(e.target.value))}
//                                 onBlur={handleBlur}
//                             />
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>

//                 {/* TanStack Form: ניהול שדה "imageLink" */}
//                 <form.Field name="imageLink"
//                     validators={{
//                         onChange: ({ value }) => !value ? "Image link is required" : undefined,
//                     }}>
//                     {({ state, handleChange, handleBlur, name }) => (
//                         <>
//                             <label htmlFor={name}>Image Link:</label>
//                             <input
//                                 id={name}
//                                 type="text"
//                                 value={state.value as string}
//                                 onChange={(e) => handleChange(e.target.value)}
//                                 onBlur={handleBlur}
//                             />
//                             {state.meta.errors && (
//                                 <p style={{ color: "red" }}>{state.meta.errors.join(", ")}</p>
//                             )}
//                         </>
//                     )}
//                 </form.Field>

//                 {/* TanStack Form: ניהול שדה "image" */}
//                 <form.Field name="image">
//                     {({ state, handleChange, name }) => (
//                         <>
//                             <label htmlFor={name}>Image:</label>
//                             <input
//                                 id={name}
//                                 type="file"
//                                 onChange={(e) => handleChange(e.target.files)}
//                             />
//                         </>
//                     )}
//                 </form.Field>

//                 <button type="submit" disabled={addShoeMutation.isPending || form.state.isSubmitting}>
//                     {addShoeMutation.isPending ? "Adding..." : "Add Shoe"}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default AddShoe;