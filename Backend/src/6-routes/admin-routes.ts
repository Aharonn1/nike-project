import express, { Request, Response, NextFunction } from "express";
import { getInventoryAlerts, getProductReturnAlerts } from "../getInventoryAlerts.js";
// אם הלוגיקה בתיקייה "5-logic", ייתכן שתצטרך לשנות ל: "../5-logic/admin-logic"

const router = express.Router();

// הראוט: הנתיב הסופי יהיה /api/admin/alerts
router.get("/alerts", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const alerts = await getInventoryAlerts();
        response.json(alerts);
    } catch (err) {
        next(err);
    }
});

// כתובת מלאה: /api/admin/returns
router.get("/returns", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const returns = await getProductReturnAlerts();
        response.json(returns);
    } catch (err) {
        next(err);
    }
});

export default router;