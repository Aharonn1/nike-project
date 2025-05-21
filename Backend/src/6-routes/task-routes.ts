import express, { Request, Response, NextFunction } from "express";
import CategoryShoesModel from "../4-models/categoryShoes-model";
import imageHandler from "../2-utils/image-handler";
import tasksService from "../4-models/tasks-service";
import CommentModel from "../4-models/commentModel";
import UserModel from "../4-models/user-model";
import ShoesModel from "../4-models/shoes-model";
import OrderModel from "../4-models/orders";

const router = express.Router();

router.get("/shoes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoes = await tasksService.getAllShoes();
        response.json(shoes)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/shoesUsers/sizes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoes = await tasksService.getAllSizes();
        response.json(shoes)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/shoesUsers1/:shoesId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoesId = +request.params.shoesId; // קבלת shoesId מהפרמטרים
        const shoes = await tasksService.getAllShoesSizes(shoesId); // העברת shoesId לפונקציה
        response.json(shoes);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/comments/:shoesId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoesId = +request.params.shoesId; // קבלת shoesId מהפרמטרים
        const shoes = await tasksService.getAllComments(shoesId); // העברת shoesId לפונקציה
        response.json(shoes);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/shoesUsers2/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoes = await tasksService.getAllShoesSizes1(); // העברת shoesId לפונקציה
        response.json(shoes);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/favorite", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const favorite = await tasksService.getAllFavorites();
        response.json(favorite)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/favorite/:shoesId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoeId = parseInt(request.params.shoesId); // המרת מזהה הנעל למספר
        const favorite = await tasksService.getFavoritesByShoeId(shoeId);
        response.json(favorite);
    } catch (err: any) {
        next(err);
    }
});

router.get("/orders3", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orders = await tasksService.getAllOrders3();
        response.json(orders)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/graphs", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoes = await tasksService.getAllOrdersAndShoesForAdmin();
        response.json(shoes)
    }
    catch (err: any) {
        next(err);
    }
});

// backend/routes/shoesUsers.ts
router.post("/shoesUsers/:userId" , async (request: Request, response: Response, next: NextFunction) => {
        try {
            const order = new OrderModel(request.body); // יצירת אובייקט הזמנה חדש
            await tasksService.buy(order); // העברת אובייקט ההזמנה בלבד
            response.status(201).send("ההזמנה התקבלה");
        } catch (err: any) {
            next(err);
        }
});


router.post("/shoesUsers1/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const order = new OrderModel(request.body);
        console.log(order)
        const newOrder = await tasksService.buy1(order);
        console.log(newOrder)
        response.sendStatus(201).json(newOrder);
    } catch (err: any) {
        next(err);
    }
});

router.post("/categoryshoes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const category = new CategoryShoesModel(request.body);
        const addCategory = await tasksService.addCategory(category);
        response.status(210).json(addCategory);
    }
    catch (err: any) {
        next(err)
    }
});

router.post("/comments", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const comment = new CommentModel(request.body);
        const addedComment = await tasksService.addComment(comment); 
        response.status(201).json(addedComment);
    } catch (err: any) {
        next(err);
    }
});

router.get("/shoesUsers", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoes = await tasksService.getAllShoes();
        response.json(shoes)

        
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/users", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const users = await tasksService.getAllUsers();
        response.json(users)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/images", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const images = await tasksService.getAllImages();
        response.json(images)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/orders", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const users = await tasksService.getAllOrders();
        response.json(users)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/categoryshoes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoes = await tasksService.getAllCategories();
        response.json(shoes)
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/shoes-per-category/:categoryId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categoryId = +request.params.categoryId;
        const category = await tasksService.getShoesByCategory(categoryId);
        response.json(category)
    } catch (err: any) {
        next(err)
    }
})

router.get('/myFavorites/:userId', async (request: Request, response: Response) => {
    try {
        const userId = +request.params.userId;
        const favorites = await tasksService.getAllFavoritesByUser(userId);
        response.json(favorites);
    } catch (error) {
        console.error("שגיאה:", error);
        response.status(500).send('שגיאה בשרת');
    }
});

router.get("/shoesUsers/:shoesId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoesId = +request.params.shoesId;
        const category = await tasksService.getOneProduct(shoesId);
        console.log(category)
        response.json(category)
    } catch (err: any) {
        next(err)
    }
})

router.get("/ordersUsers/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const category = await tasksService.getAllOrdersAndShoesOfUser(userId);
        response.json(category)
    } catch (err: any) {
        next(err)
    }
})

router.put("/ordersUsers/:userId", async (request: Request, response: Response, next: NextFunction) => {
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

        await tasksService.updateOrdersStatusToOne(ordersToUpdate, userId);
        response.json({ message: "Order statuses updated successfully." });
    } catch (error) {
        next(error);
    }
});

router.get("/clothing-per-category/:categoryId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categoryId = +request.params.categoryId;
        const category = await tasksService.getShoesByCategory(categoryId);
        response.json(category)
    } catch (err: any) {
        next(err)
    }
})

router.get("/shoesUsers/images/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = imageHandler.getAbsolutePath(imageName)
        response.sendFile(absolutePath)
    } catch (err: any) {
        next(err)
    }
})

router.post("/shoes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const shoes = new ShoesModel(request.body);
        const addedShoes = await tasksService.addShoes(shoes);
        response.status(210).json(addedShoes);
    }
    catch (err: any) {
        next(err);
    }
});

router.delete("/categoryshoes/:categoryId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categoryId = +request.params.categoryId;
        await tasksService.deleteCategory(categoryId);
        response.sendStatus(204)
    } catch (err: any) {
        next(err)
    }
})

router.delete("/shoesUsers/:orderId([0-9]+)", async (request: Request, response, next: NextFunction) => {
    try {
        const orderId = +request.params.orderId;
        console.log("orderId ", orderId)
        await tasksService.deleteOrder(orderId);
        response.sendStatus(204)
    } catch (err: any) {
        next(err)
    }
});

router.delete("/shoesUsers1/:orderId([0-9]+)", async (request: Request, response, next: NextFunction) => {
    try {
        const orderId = +request.params.orderId;
        console.log("orderId ", orderId)
        await tasksService.deleteOrder1(orderId);
        response.sendStatus(204)
    } catch (err: any) {
        next(err)
    }
});

router.put("/categoryshoes/:categoryId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.categoryId = +request.params.categoryId;
        const category = new CategoryShoesModel(request.body);
        const updateCategory = await tasksService.updateCategory(category);
        response.json(updateCategory);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/orders/:orderId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.orderId = +request.params.orderId;
        const order = new OrderModel(request.body);
        const updateOrder = await tasksService.buyOrder(order);
        response.json(updateOrder);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/myAccount/:userId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.userId = +request.params.userId;
        const user = new UserModel(request.body);
        console.log(user)
        const updateUser = await tasksService.getUserAccount(user);
        response.json(updateUser);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/shoes/:shoesId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.shoesId = +request.params.shoesId;
        const shoes = new ShoesModel(request.body);
        const updateProduct = await tasksService.updateProduct(shoes);
        response.json(updateProduct);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/categoryshoes/:categoryId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categoryId = +request.params.categoryId;
        const category = await tasksService.getOneCategory(categoryId);
        response.json(category)
    } catch (err: any) {
        next(err)
    }
})

router.post("/shoesUsers/favorite/:shoesId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoesId = +request.params.shoesId; // קבלת shoesId מ- params
        const userId = request.body.userId;
        const userIdNumber = userId.userId;
        await tasksService.favorite(userIdNumber, shoesId);
        response.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.delete("/shoesUsers/favorite/:shoesId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const shoesId = +request.params.shoesId;
        const userId = request.body.userId;
        await tasksService.unfavorite(userId, shoesId);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;