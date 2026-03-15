// --- ייבוא חבילות צד-שלישי ---
import express from "express"; 
import cors from "cors";
import expressFileUpload from "express-fileupload";

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

const server = express();

const finalImagesPath = "/home/ubuntu/backend/dist/1-assets/images/images";

// הוספת לוג כדי לראות בטרמינל שהנתיב נטען
console.log("Serving images from: " + finalImagesPath);

server.use("/api/images", express.static(finalImagesPath));
server.use("/api/shoesUsers/images", express.static(finalImagesPath));

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

// --- 3. הגדרת נתיבי API ---
server.use("/api", authRoutes);
server.use("/api", taskRoutes);
server.use("/api", aiRoutes);
server.use("/api", braingineController);
server.use("/api/admin", adminRoutes); 

// --- 4. טיפול בשגיאות ---
server.use(routeNotFound);
server.use(catchAll);

// --- 5. הפעלת השרת ---
const config = AppConfig as any;

(async () => {
    try {
        await ensureAllAssetsCopied(); 

        server.listen(config.port, '0.0.0.0', () => {
            console.log(`🚀 Braingine Server is running on port ${config.port}`);
            console.log(`📁 Static files served from: ${finalImagesPath}`);
        });
        
    } catch (err) {
        console.error("Failed to start server:", err);
    }
})();