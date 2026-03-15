"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryShoes_model_js_1 = __importDefault(require("../4-models/categoryShoes-model.js"));
const image_handler_js_1 = __importDefault(require("../2-utils/image-handler.js"));
const commentModel_js_1 = __importDefault(require("../4-models/commentModel.js"));
const user_model_js_1 = __importDefault(require("../4-models/user-model.js"));
const shoes_model_js_1 = __importDefault(require("../4-models/shoes-model.js"));
const orders_js_1 = __importDefault(require("../4-models/orders.js"));
const tasks_service_js_1 = __importDefault(require("../4-models/tasks-service.js"));
const router = express_1.default.Router();
router.get("/shoes", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllShoes();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/shoesUsers/sizes", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllSizes();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/shoesUsers1/:shoesId", async (request, response, next) => {
    try {
        const shoesId = +request.params.shoesId; // קבלת shoesId מהפרמטרים
        const shoes = await tasks_service_js_1.default.getAllShoesSizes(shoesId); // העברת shoesId לפונקציה
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/comments/:shoesId", async (request, response, next) => {
    try {
        const shoesId = +request.params.shoesId; // קבלת shoesId מהפרמטרים
        const shoes = await tasks_service_js_1.default.getAllComments(shoesId); // העברת shoesId לפונקציה
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/shoesUsers2/", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllShoesSizes1(); // העברת shoesId לפונקציה
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/favorite", async (request, response, next) => {
    try {
        const favorite = await tasks_service_js_1.default.getAllFavorites();
        response.json(favorite);
    }
    catch (err) {
        next(err);
    }
});
router.get("/favorite/:shoesId", async (request, response, next) => {
    try {
        const shoeId = parseInt(request.params.shoesId); // המרת מזהה הנעל למספר
        const favorite = await tasks_service_js_1.default.getFavoritesByShoeId(shoeId);
        response.json(favorite);
    }
    catch (err) {
        next(err);
    }
});
router.get("/graphs", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllOrdersAndShoesForAdmin();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
// router.post("/shoesUsers/:userId", async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         const order = new OrderModel(request.body); // יצירת אובייקט הזמנה חדש
//         await tasksService.buy(order); // העברת אובייקט ההזמנה בלבד
//         response.status(201).send("ההזמנה התקבלה");
//     } catch (err: any) {
//         next(err);
//     }
// });
router.post("/shoesUsers/:userId", async (request, response, next) => {
    try {
        const order = new orders_js_1.default(request.body);
        console.log(order);
        const newOrder = await tasks_service_js_1.default.buy1(order);
        console.log(newOrder);
        // 🏆 התיקון: Chain נכון לסטטוס ותוכן
        return response.status(201).json(newOrder);
    }
    catch (err) {
        return next(err);
    }
});
router.post("/categoryshoes", async (request, response, next) => {
    try {
        const category = new categoryShoes_model_js_1.default(request.body);
        const addCategory = await tasks_service_js_1.default.addCategory(category);
        response.status(210).json(addCategory);
    }
    catch (err) {
        next(err);
    }
});
router.post("/comments", async (request, response, next) => {
    try {
        const comment = new commentModel_js_1.default(request.body);
        const addedComment = await tasks_service_js_1.default.addComment(comment);
        response.status(201).json(addedComment);
    }
    catch (err) {
        next(err);
    }
});
router.get("/shoesUsers", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllShoes();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/users", async (request, response, next) => {
    try {
        const users = await tasks_service_js_1.default.getAllUsers();
        response.json(users);
    }
    catch (err) {
        next(err);
    }
});
router.get("/usersForAdmin", async (request, response, next) => {
    try {
        const users = await tasks_service_js_1.default.getAllUsersForAdmin();
        response.json(users);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/usersForAdmin/:userId", async (request, response, next) => {
    try {
        const userId = +request.params.userId;
        if (isNaN(userId)) {
            return response.status(400).json({ message: "Invalid User ID provided." });
        }
        await tasks_service_js_1.default.deleteUser(userId);
        response.status(200).json({ message: `User ID ${userId} deleted successfully.` });
    }
    catch (error) {
        console.error(`❌ Error in DELETE /usersForAdmin/${request.params.userId}:`, error);
        if (error.message.includes('לא נמצא')) { // Check for the specific error message if user not found
            return response.status(404).json({ message: error.message }); // 404 Not Found if user doesn't exist
        }
        next(error);
    }
});
router.get("/images", async (request, response, next) => {
    try {
        const images = await tasks_service_js_1.default.getAllImages();
        response.json(images);
    }
    catch (err) {
        next(err);
    }
});
router.get("/orders", async (request, response, next) => {
    try {
        const users = await tasks_service_js_1.default.getAllOrders();
        response.json(users);
    }
    catch (err) {
        next(err);
    }
});
router.get("/ordersPerMonth", async (request, response, next) => {
    try {
        const users = await tasks_service_js_1.default.getAllOrdersPerMonth();
        response.json(users);
    }
    catch (err) {
        next(err);
    }
});
router.get("/categoryshoes", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllCategories();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/mySupply", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllMySupply();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/repeatOrders", async (request, response, next) => {
    try {
        const shoes = await tasks_service_js_1.default.getAllCancelOrders();
        response.json(shoes);
    }
    catch (err) {
        next(err);
    }
});
router.get("/shoes-per-category/:categoryId", async (request, response, next) => {
    try {
        const categoryId = +request.params.categoryId;
        const category = await tasks_service_js_1.default.getShoesByCategory(categoryId);
        response.json(category);
    }
    catch (err) {
        next(err);
    }
});
router.get('/myFavorites/:userId', async (request, response) => {
    try {
        const userId = +request.params.userId;
        const favorites = await tasks_service_js_1.default.getAllFavoritesByUser(userId);
        response.json(favorites);
    }
    catch (error) {
        console.error("שגיאה:", error);
        response.status(500).send('שגיאה בשרת');
    }
});
router.get("/shoesUsers/:shoesId", async (request, response, next) => {
    try {
        const shoesId = +request.params.shoesId;
        const category = await tasks_service_js_1.default.getOneProduct(shoesId);
        console.log(category);
        response.json(category);
    }
    catch (err) {
        next(err);
    }
});
router.get("/ordersUsers/:userId", async (request, response, next) => {
    try {
        const userId = +request.params.userId;
        const category = await tasks_service_js_1.default.getAllOrdersAndShoesOfUser(userId);
        response.json(category);
    }
    catch (err) {
        next(err);
    }
});
router.get("/ordersUsers3/:userId", async (request, response, next) => {
    try {
        const userId = +request.params.userId;
        const category = await tasks_service_js_1.default.getAllOrdersAndShoesOfUser3(userId);
        response.json(category);
    }
    catch (err) {
        next(err);
    }
});
router.put("/ordersUsers/:userId", async (request, response, next) => {
    try {
        const userId = +request.params.userId;
        const ordersToUpdate = request.body;
        if (!Array.isArray(ordersToUpdate)) {
            return response.status(400).json({ message: "Invalid request body. Expected an array of orders." });
        }
        for (const order of ordersToUpdate) {
            if (!order.orderId) {
                return response.status(400).json({ message: "Invalid request body. Each order must have an orderId." });
            }
        }
        await tasks_service_js_1.default.updateOrdersStatusToOne(ordersToUpdate, userId);
        response.json({ message: "Order statuses updated successfully." });
    }
    catch (error) {
        next(error);
    }
});
router.put("/mySupply/", async (request, response, next) => {
    try {
        const shoeSizeData = request.body;
        if (!shoeSizeData || typeof shoeSizeData.shoesId !== 'number' || typeof shoeSizeData.sizeId !== 'number' || typeof shoeSizeData.stock !== 'number' || shoeSizeData.stock < 0) {
            return response.status(400).json({ message: "Invalid request data. Expected shoesId (number), sizeId (number), and stock (non-negative number)." });
        }
        await tasks_service_js_1.default.updateShoeSizeStock(shoeSizeData);
        response.status(200).json({ message: "מלאי המידה עודכן בהצלחה." });
    }
    catch (error) {
        console.error("שגיאה בראוטר PUT /mySupply/:", error);
        if (error.message.includes('לא נמצאה לעדכון')) {
            return response.status(404).json({ message: error.message });
        }
        next(error);
    }
});
router.get("/clothing-per-category/:categoryId", async (request, response, next) => {
    try {
        const categoryId = +request.params.categoryId;
        const category = await tasks_service_js_1.default.getShoesByCategory(categoryId);
        response.json(category);
    }
    catch (err) {
        next(err);
    }
});
router.get("/shoesUsers/images/:imageName", async (request, response, next) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = image_handler_js_1.default.getAbsolutePath(imageName);
        response.sendFile(absolutePath);
    }
    catch (err) {
        next(err);
    }
});
router.post("/shoes", async (request, response, next) => {
    try {
        request.body.image = request.files?.image;
        const shoes = new shoes_model_js_1.default(request.body);
        const addedShoes = await tasks_service_js_1.default.addShoes(shoes);
        response.status(210).json(addedShoes);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/categoryshoes/:categoryId([0-9]+)", async (request, response, next) => {
    try {
        const categoryId = +request.params.categoryId;
        await tasks_service_js_1.default.deleteCategory(categoryId);
        response.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/shoesUsers/:orderId([0-9]+)", async (request, response, next) => {
    try {
        const orderId = +request.params.orderId;
        console.log("orderId ", orderId);
        await tasks_service_js_1.default.deleteOrder(orderId);
        response.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/shoesUsers1/:orderId([0-9]+)", async (request, response, next) => {
    try {
        const orderId = +request.params.orderId;
        console.log("orderId ", orderId);
        await tasks_service_js_1.default.deleteOrder1(orderId);
        response.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
router.put("/categoryshoes/:categoryId([0-9]+)", async (request, response, next) => {
    try {
        request.body.categoryId = +request.params.categoryId;
        const category = new categoryShoes_model_js_1.default(request.body);
        const updateCategory = await tasks_service_js_1.default.updateCategory(category);
        response.json(updateCategory);
    }
    catch (err) {
        next(err);
    }
});
router.put("/ordersUsers/:userId/:orderId([0-9]+)", async (request, response, next) => {
    try {
        const userId = +request.params.userId;
        const orderId = +request.params.orderId;
        const comment = request.body.comment;
        const updatedOrder = await tasks_service_js_1.default.updateOrderStatus2(orderId, userId, comment);
        response.json(updatedOrder);
    }
    catch (error) {
        console.error("ERROR (Backend Route): Uncaught error during order status update:", error);
        next(error);
    }
});
router.put("/creditCardForm/:userId/:orderId([0-9]+)", async (request, response, next) => {
    try {
        const userId = +request.params.userId;
        const orderId = +request.params.orderId;
        const userExperience = +request.body.userExperience;
        const userCommentExperience = request.body.userCommentExperience;
        const updatedOrder = await tasks_service_js_1.default.updateUserExperience(orderId, userId, userExperience, userCommentExperience);
        response.json(updatedOrder);
    }
    catch (error) {
        console.error("ERROR (Backend Route): Uncaught error during order status update:", error);
        next(error);
    }
});
router.put("/mySales/:shoesId([0-9]+)", async (request, response, next) => {
    try {
        request.body.shoesId = +request.params.shoesId;
        const shoes = new shoes_model_js_1.default(request.body);
        const updatePrice = await tasks_service_js_1.default.updatePrice(shoes);
        response.json(updatePrice);
    }
    catch (err) {
        next(err);
    }
});
router.put("/orders/:orderId([0-9]+)", async (request, response, next) => {
    try {
        request.body.orderId = +request.params.orderId;
        const order = new orders_js_1.default(request.body);
        const updateOrder = await tasks_service_js_1.default.buyOrder(order);
        response.json(updateOrder);
    }
    catch (err) {
        next(err);
    }
});
router.put("/myAccount/:userId([0-9]+)", async (request, response, next) => {
    try {
        request.body.userId = +request.params.userId;
        const user = new user_model_js_1.default(request.body);
        console.log(user);
        const updateUser = await tasks_service_js_1.default.getUserAccount(user);
        response.json(updateUser);
    }
    catch (err) {
        next(err);
    }
});
router.put("/shoes/:shoesId([0-9]+)", async (request, response, next) => {
    try {
        request.body.shoesId = +request.params.shoesId;
        const shoes = new shoes_model_js_1.default(request.body);
        const updateProduct = await tasks_service_js_1.default.updateProduct(shoes);
        response.json(updateProduct);
    }
    catch (err) {
        next(err);
    }
});
router.get("/categoryshoes/:categoryId([0-9]+)", async (request, response, next) => {
    try {
        const categoryId = +request.params.categoryId;
        const category = await tasks_service_js_1.default.getOneCategory(categoryId);
        response.json(category);
    }
    catch (err) {
        next(err);
    }
});
router.post("/shoesUsers/favorite/:shoesId", async (request, response, next) => {
    try {
        const shoesId = +request.params.shoesId;
        // ✅ תיקון קריטי: קוראים את userId ישירות מה-Body
        const userId = +request.body.userId;
        await tasks_service_js_1.default.favorite(userId, shoesId);
        response.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/shoesUsers/favorite/:shoesId", async (request, response, next) => {
    try {
        const shoesId = +request.params.shoesId;
        // ✅ תיקון קריטי: קוראים את userId ישירות מה-Body גם עבור DELETE
        const userId = +request.body.userId;
        await tasks_service_js_1.default.unfavorite(userId, shoesId);
        response.sendStatus(204); // 204 No Content הוא קוד תקין למחיקה
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
