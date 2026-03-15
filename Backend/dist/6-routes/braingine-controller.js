"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const braingine_service_js_1 = __importDefault(require("../5-services/braingine-service.js"));
const router = express_1.default.Router();
// Route להפעלת תהליך הוקטוריזציה על כל הנעליים
router.post("/braingine/ingest", async (req, res, next) => {
    try {
        // קריאה לפונקציה ללא פרמטרים כפי שהגדרנו ב-Service
        await braingine_service_js_1.default.addKnowledge();
        res.status(200).json({ message: "Inference process completed successfully for all shoes." });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
