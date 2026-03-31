import express from "express";
import cors from "cors";
import expressFileUpload from "express-fileupload";
import dotenv from "dotenv";
import { createClient } from "redis";

// 1. טעינת משתני סביבה ואימות (Pre-flight Check)
dotenv.config();

const requiredEnvVars = [
    'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
    'JWT_SECRET', 'GEMINI_API_KEY', 'PORT'
];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ שגיאה קריטית: משתנה הסביבה ${key} חסר ב-env.`);
        process.exit(1); 
    }
});
console.log("✅ Environment variables validated.");

// --- ייבוא כלי עזר ו-Middleware ---
import AppConfig from "./2-utils/appConfig.js";
import routeNotFound from "./3-middleware/route-not-found.js";
import catchAll from "./3-middleware/catch-all.js";
import { ensureAllAssetsCopied } from "./2-utils/file-utils.js";

// --- ייבוא נתיבים (Routes) ---
import authRoutes from "./6-routes/auth-routes.js";
import taskRoutes from "./6-routes/task-routes.js";
import aiRoutes from "./6-routes/ai-routes.js";
import adminRoutes from "./6-routes/admin-routes.js";
import braingineController from "./6-routes/braingine-controller.js";

interface IAppConfig {
    port: number;
}

const server = express();
const config = (AppConfig as unknown) as IAppConfig;

// --- הגדרת Redis (ארכיטקטורת Caching) ---
const redisClient = createClient({
    url: "redis://redis:6379"
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
redisClient.on("connect", () => console.log("🚀 Redis Connected Successfully!"));

// --- 2. הגדרת Middleware גלובלי ---
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://www.shoes-shop-pro.com",
        "https://shoes-shop-pro.com"
    ],
    credentials: true,
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(expressFileUpload());

// --- 🎯 נתיב Health Check (מוגדר מוקדם ככל האפשר) ---
// זהו הצינור שדוקר יבדוק כל 30 שניות
server.get("/api/health", async (req, res) => {
    try {
        // בודקים אם רדיס מחובר ומגיב
        if (!redisClient.isOpen) throw new Error("Redis connection is closed");
        await redisClient.ping();
        
        res.status(200).json({ status: "UP", services: { redis: "OK" } });
    } catch (err) {
        console.error("⚠️ Health Check Failed:", err.message);
        res.status(503).json({ status: "DOWN", reason: err.message });
    }
});

// --- נתיבים לנכסים סטטיים ---
const finalImagesPath = "/home/ubuntu/backend/dist/1-assets/images/images";
server.use("/api/images", express.static(finalImagesPath));
server.use("/api/shoesUsers/images", express.static(finalImagesPath));

// --- 3. הגדרת נתיבי API ---
server.use("/api", authRoutes);
server.use("/api", taskRoutes);
server.use("/api", aiRoutes);
server.use("/api", braingineController);
server.use("/api/admin", adminRoutes);

// --- 4. טיפול בשגיאות (חייב להיות בסוף הנתיבים) ---
server.use(routeNotFound);
server.use(catchAll);

// --- 5. הפעלת השרת (Bootstrap) ---
(async () => {
    try {
        // חיבור ל-Redis - סניור מוד: לא מפילים שרת בגלל קאש
        try {
            await redisClient.connect();
        } catch (redisErr) {
            console.error("⚠️ Warning: Could not connect to Redis. Caching will be disabled.");
        }

        // וידוא נכסים (Assets)
        await ensureAllAssetsCopied();

        // הפעלת האזנה
        server.listen(config.port, '0.0.0.0', () => {
            console.log("-----------------------------------------");
            console.log(`🚀 Braingine Server Running | Port: ${config.port}`);
            console.log("🚀 Senior mode active - Server is UP!");
            console.log(`📁 Static files path: ${finalImagesPath}`);
            console.log("-----------------------------------------");
        });

    } catch (err) {
        console.error("❌ Critical Failure: Failed to start server:", err);
        process.exit(1);
    }
})();

export { redisClient };