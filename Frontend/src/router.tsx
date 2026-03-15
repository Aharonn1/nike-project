import {
    createRouter,
    createRoute,
    Outlet,
    createRootRoute,
    RouterProvider,
    redirect,
} from "@tanstack/react-router";
import App from "./App";
import Login from "./Project1/Login";
import Register from "./Project1/Register";
import ProductsUsers from "./Project1/ProductsUsers";
import Categories from "./Project1/Categories";
import Users from "./Project1/Users";
import AddCategory from "./Project1/AddCategory";
import { NavBarAdmin } from "./Project1/NavBarAdmin";
import { NavBarUsers } from "./Project1/navBarUsers";
import MyAccount from "./Project1/MyAccount";
import Example from "./Project1/Graph";
import MyFavorites from "./Project1/MyFavorites";
import CreditCardForm from "./Project1/CreditCardForm";
import MySales from "./Project1/MySales";
import AdminUsers from "./Project1/AdminUsers";
import MySupply from "./Project1/MySupply";
import RepeatOrders from "./Project1/RepeatOrders";
import OrdersPerMonth from "./Project1/OrdersPerMonth";
import UserExperience from "./Project1/UserExperience";
import OrdersUsers from "./Project1/OrdersUsers";
import Shop from "./Project1/ProductsPage";
import dataService from "./Service/DataService";
import GraphWrapper from "./Project1/GraphWrapper";
import OneProductsCard from "./Project1/OneProductsCard";
import { NavBar } from "./Project1/NavBar";
// ✅ ייבוא הקומפוננטה החדשה של ה-AI
import { ProductAiChat } from "./Project1/ProductAiChat";



const ProductsList = Shop;

// הגדרת נתיב הבסיס של האפליקציה כולה.

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

// הגדרת נתיב המעטפת (layout) הראשי עם סרגל ניווט כללי.

const mainLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => (
        <>
            <NavBar />
            <Outlet />
        </>
    ),
});



// נתיבים שאינם מקוננים תחת מעטפת

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "Login",
    component: Login,
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "Register",
    component: Register,
});

// נתיב מעטפת עבור כל דפי האדמין.
const adminLayoutRoute = createRoute({
    getParentRoute: () => mainLayoutRoute,
    path: "admin",
    // לוגיקה של בדיקת הרשאות לפני טעינת הרכיב
    beforeLoad: () => {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user?.userData?.role;

        // אם אין טוקן או שהמשתמש אינו מנהל, ננתב אותו לדף ההתחברות.
        if (!token || role !== 'admin') {
            throw redirect({ to: '/Login' });
        }
    },
    component: () => (
        <>
            <NavBarAdmin />
            <Outlet />
        </>
    ),
});


// נתיב מעטפת עבור כל דפי המשתמשים.

const userLayoutRoute = createRoute({
    getParentRoute: () => mainLayoutRoute,
    path: "user",
    component: () => (
        <>
            <NavBarUsers />
            <Outlet />
        </>
    ),
});

export const productsUsersRoute = createRoute({
    getParentRoute: () => userLayoutRoute,
    path: "shoesUsers",
    // ✅ תיקון: רכיב זה משמש כמעטפת בלבד
    component: ProductsUsers,
    loader: () => dataService.getAllShoes(),
});

const productsListIndexRoute = createRoute({
    getParentRoute: () => productsUsersRoute,
    path: "/",
    component: ProductsUsers, // ✅ תיקון: זהו רכיב התוכן בפועל
});


export const oneProductsCardRoute = createRoute({
    getParentRoute: () => productsUsersRoute,
    path: "$shoesId",
    component: OneProductsCard,
    // ✅ Fix: Add a loader to the route itself
    loader: ({ params }) => {
        return dataService.getShoeById(+(params.shoesId));
    },
});

// נתיבי הילד של אזור הניהול.

const adminUsersRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "users",
    component: AdminUsers,
});

const adminShoesRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "shoes",
    component: ProductsList,
});

const ordersPerMonthRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "ordersPerMonth",
    component: OrdersPerMonth,
});

const userExperienceRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "userExperience",
    component: UserExperience,
});

const categoriesRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "categoryshoes",
    component: Categories,
});

const addCategoryRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "categoryshoes/new",
    component: AddCategory,
});

const mySupplyRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "mySupply",
    component: MySupply,
});

const mySalesRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "mySales",
    component: MySales,
});

const allUsersRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "all-users",
    component: Users,
});

const repeatOrdersRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "repeatOrders",
    component: RepeatOrders,
});

const graphsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "graphs",
    component: GraphWrapper,
});

// נתיבי הילד של אזור המשתמשים.

const ordersUsersRoute = createRoute({
    getParentRoute: () => userLayoutRoute,
    path: "ordersUsers",
    component: OrdersUsers,
});

const myAccountRoute = createRoute({
    getParentRoute: () => userLayoutRoute,
    path: "myAccount",
    component: MyAccount,
});

const myFavoritesRoute = createRoute({
    getParentRoute: () => userLayoutRoute,
    path: "myFavorites",
    component: MyFavorites,
});

const creditCardFormRoute = createRoute({
    getParentRoute: () => userLayoutRoute,
    path: "creditCardForm",
    component: CreditCardForm,
});

const aiChatRoute = createRoute({
    getParentRoute: () => userLayoutRoute,
    path: "ai-chat",
    component: () => (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>

            {/* 🎯 תיקון: העברת undefined או 0 כ-productId כדי להפעיל חיפוש גלובלי */}
            <ProductAiChat
                productDescription="אני העוזר החכם של החנות! שאל אותי שאלות כלליות על כל המאגר."
            />
        </div>
    ),
});

// בניית עץ הניתוב.
const routeTree = rootRoute.addChildren([
    loginRoute,
    registerRoute,
    mainLayoutRoute.addChildren([
        adminLayoutRoute.addChildren([
            adminUsersRoute,
            ordersPerMonthRoute,
            userExperienceRoute,
            categoriesRoute,
            addCategoryRoute,
            mySupplyRoute,
            mySalesRoute,
            allUsersRoute,
            repeatOrdersRoute,
            graphsRoute,
            adminShoesRoute
        ]),

        userLayoutRoute.addChildren([
            productsUsersRoute.addChildren([productsListIndexRoute, oneProductsCardRoute]),
            ordersUsersRoute,
            myAccountRoute,
            myFavoritesRoute,
            creditCardFormRoute,
            aiChatRoute, // ✅ הוספנו את הנתיב החדש לעץ
        ]),
    ]),

]);

export const router = createRouter({ routeTree });

// הצהרה על מבנה הראוטר עבור TypeScript.
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default router;