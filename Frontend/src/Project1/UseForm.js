// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const UseForm = () => {
//     const [values, setValues] = useState({
//         name: '',
//         number: '',
//         expiration: '',
//         cvc: '',
//         focus: ''
//     });

//     const navigate = useNavigate();
//     const [errors, setErrors] = useState({}); // הוספת setErrors

//     const handleFocus = (e) => {
//         setValues({
//             ...values,
//             focus: e.target.name
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // בדיקות תקינות עבור כל שדה
//         const validationErrors = {}; 
//         if (name === "name" && !/^[a-zA-Z]+$/.test(value)) {
//             validationErrors.name = "שם צריך להכיל אותיות בלבד";
//         } else if (name === "number" && !/^\d{16}$/.test(value)) {
//             validationErrors.number = "מספר כרטיס צריך להיות בן 16 ספרות";
//         } else if (name === "expiration" && !/^\d{2}\/\d{2}$/.test(value)) {
//             validationErrors.expiration = "תוקף צריך להיות בפורמט MM/YY";
//         } else if (name === "cvc" && !/^\d{3}$/.test(value)) {
//             validationErrors.cvc = "CVC צריך להיות בן 3 ספרות";
//         }

//         setErrors(validationErrors); // עדכון errors state

//         setValues({
//             ...values,
//             [name]: value
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // בדיקת תקינות לפני שליחה
//         if (Object.keys(errors).length === 0) {
//             // notify.success("הסרט נקנה בהצלחה");
//             navigate("/home");
//         } else {
//             // notify.error("אנא תקן את השגיאות בטופס");
//         }
//     };

//     return { handleChange, handleFocus, handleSubmit, values, errors };
// };

// export default UseForm;