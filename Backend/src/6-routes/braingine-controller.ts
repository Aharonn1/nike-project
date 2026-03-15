import express, { Request, Response, NextFunction } from "express";
import braingineService from "../5-services/braingine-service.js";

const router = express.Router();

// Route להפעלת תהליך הוקטוריזציה על כל הנעליים
router.post("/braingine/ingest", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // קריאה לפונקציה ללא פרמטרים כפי שהגדרנו ב-Service
        await braingineService.addKnowledge();
        
        res.status(200).json({ message: "Inference process completed successfully for all shoes." });
    } catch (err) {
        next(err);
    }
});

export default router;