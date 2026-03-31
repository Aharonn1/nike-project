import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import expressFileUpload from "express-fileupload";
import dotenv from "dotenv";
import { createClient } from "redis";
import client from "prom-client";

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

// --- 📊 הגדרת Metrics (Prometheus) ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// מדד סניורי: מונה בקשות לפי נתיב וסטטוס
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware לתיעוד כל בקשה שנכנסת
server.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        if (req.route) {
            httpRequestCounter.labels(req.method, req.route.path, res.statusCode.toString()).inc();
        }
    });
    next();
});

// נתיב ה-Metrics עבור Prometheus
server.get("/metrics", async (req: Request, res: Response) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

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

// --- 🎯 נתיב Health Check ---
server.get("/api/health", async (req: Request, res: Response) => {
    try {
        if (!redisClient.isOpen) throw new Error("Redis connection is closed");
        await redisClient.ping();
        res.status(200).json({ status: "UP", services: { redis: "OK" } });
    } catch (err: any) {
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

// --- 4. טיפול בשגיאות ---
server.use(routeNotFound);
server.use(catchAll);

// --- 5. הפעלת השרת (Bootstrap) ---
(async () => {
    try {
        try {
            await redisClient.connect();
        } catch (redisErr) {
            console.error("⚠️ Warning: Could not connect to Redis. Caching will be disabled.");
        }

        await ensureAllAssetsCopied();

        server.listen(config.port, '0.0.0.0', () => {
            console.log("-----------------------------------------");
            console.log(`🚀 Braingine Server Running | Port: ${config.port}`);
            console.log("🚀 Senior mode active - Server is UP!");
            console.log(`📁 Metrics available at: http://localhost:${config.port}/metrics`);
            console.log("-----------------------------------------");
        });

    } catch (err) {
        console.error("❌ Critical Failure: Failed to start server:", err);
        process.exit(1);
    }
})();

export { redisClient };