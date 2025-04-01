import React, { createContext, useState, useEffect } from 'react';
import Login from "./Project1/Login";
import Register from "./Project1/Register";
import { NavBar } from "./Project1/NavBar";
import Categories from "./Project1/Categories";
import Users from "./Project1/Users";
import Products from "./Project1/Products";
import Update from "./Project1/Update";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddCategory from "./Project1/AddCategory"
import { NavBarAdmin } from "./Project1/NavBarAdmin";
import { NavBarUsers } from "./Project1/navBarUsers";
import AddShoe from "./Project1/AddProduct";
import OrdersUsers from "./Project1/OrdersUsers";
import ProductsUsers from "./Project1/ProductsUsers";
import MyAccount from "./Project1/MyAccount"
import Example from "./Project1/Graph";
import MyFavorites from "./Project1/MyFavorites";
import OneProductsCard from "./Project1/OneProductsCard";
import CreditCardForm from './Project1/CreditCardForm'; // הוספת .jsx
function App() {



  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/categoryshoes" element={<Categories />} />
        <Route path="/categoryshoes/:categoryId" element={<Update />} />
        <Route path="/categoryshoes/new" element={<AddCategory />} />
        <Route path="/shoes/new" element={<AddShoe />} />
        <Route path="/shoes" element={<Products />} />
        <Route path="/shoesUsers" element={<ProductsUsers />} />
        <Route path="/ordersUsers/" element={<OrdersUsers/>} />
        <Route path="/users" element={<Users />} />
        <Route path="/navBarAdmin" element={<NavBarAdmin />} />
        <Route path="/navBarUsers" element={<NavBarUsers />} />
        <Route path="/myAccount" element={<MyAccount />} />
        <Route path="/myFavorites" element={<MyFavorites />} />
        <Route path="/creditCardForm" element={<CreditCardForm />} />
        <Route path="/graphs" element={<Example />} />
        <Route path="/shoesUsers/:shoesId" element={<OneProductsCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
