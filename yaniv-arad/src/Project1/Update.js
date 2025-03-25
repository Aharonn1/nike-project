// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import dataService from "../Service/DataService";
// import { useForm } from "react-hook-form";

// function Update() {
//   const params = useParams();
//   const navigate = useNavigate();
//   const { register, handleSubmit, setValue } = useForm();
//   const [category, setCategory] = useState([]);

//   useEffect(() => {
//     dataService
//       .getOneCategory(+params.categoryId)
//       .then((category) => {
//         setValue("categoryId", category.categoryId);
//         setValue("categoryName", category.categoryName);
//         setCategory(category);
//       })
//       .catch((err) => alert(err.message));
//   }, []);

//   async function send(category) {
//     console.log(category);
//     await dataService.updateCategory(category);
//     navigate(-1); // Back
//   }

//   return (
//     <div className="d-flex w-100 vh-100 justify-content-center align-item-center">
//       <div className="w-50 border bg-secondary text-white p-5">
//         <form onSubmit={handleSubmit(send)}>
//           <div>
//             <label htmlFor="name">Name</label>
//             <input
//               type="text"
//               name="name"
//               className="form-control"
//               placeholder="Enter Name"
//               {...register("categoryName")}
//             />
//           </div>
//           <button className="btn btn-info">Update</button>
//         </form>
//       </div>
//     </div>
//   );
// }
// export default Update;
