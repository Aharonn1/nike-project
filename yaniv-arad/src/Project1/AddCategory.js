import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dataService from "../Service/DataService";

function AddCategory(){

    const [category,setCategory] = useState();
    const{register,handleSubmit} = useForm();
    const navigate = useNavigate();

    async function send(category){
        console.log(category);
        try{
            await dataService.createCategory(category);
            navigate("/categoryshoes")
        }catch(err){
            alert(err.message)
        }
    }

    return (
        <div className="AddVacation Box">
			<h1>added vacation</h1>
            <form onSubmit={handleSubmit(send)}>

                <label>Category Name</label>
                <input type="text" {...register("categoryName")}/>

                <label>Sale: </label>
                <input type="text" {...register("sale")}/>

                <button>Add</button>
            </form>
        </div>
    );
}

export default AddCategory;
