"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --- ייבוא חבילות צד-שלישי ---
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// --- ייבוא כלי עזר ו-Middleware ---
const appConfig_js_1 = __importDefault(require("./2-utils/appConfig.js"));
const route_not_found_js_1 = __importDefault(require("./3-middleware/route-not-found.js"));
const catch_all_js_1 = __importDefault(require("./3-middleware/catch-all.js"));
const file_utils_js_1 = require("./2-utils/file-utils.js");
// --- ייבוא נתיבים (Routes) ---
const auth_routes_js_1 = __importDefault(require("./6-routes/auth-routes.js"));
const task_routes_js_1 = __importDefault(require("./6-routes/task-routes.js"));
const ai_routes_js_1 = __importDefault(require("./6-routes/ai-routes.js"));
const admin_routes_js_1 = __importDefault(require("./6-routes/admin-routes.js"));
const braingine_controller_js_1 = __importDefault(require("./6-routes/braingine-controller.js"));
const server = (0, express_1.default)();
const finalImagesPath = "/home/ubuntu/backend/dist/1-assets/images/images";
// הוספת לוג כדי לראות בטרמינל שהנתיב נטען
console.log("Serving images from: " + finalImagesPath);
server.use("/api/images", express_1.default.static(finalImagesPath));
server.use("/api/shoesUsers/images", express_1.default.static(finalImagesPath));
// --- 2. הגדרת Middleware גלובלי ---
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://www.shoes-shop-pro.com",
        "https://shoes-shop-pro.com"
    ],
    credentials: true,
};
server.use((0, cors_1.default)(corsOptions));
server.use(express_1.default.json());
server.use((0, express_fileupload_1.default)());
// --- 3. הגדרת נתיבי API ---
server.use("/api", auth_routes_js_1.default);
server.use("/api", task_routes_js_1.default);
server.use("/api", ai_routes_js_1.default);
server.use("/api", braingine_controller_js_1.default);
server.use("/api/admin", admin_routes_js_1.default);
// --- 4. טיפול בשגיאות ---
server.use(route_not_found_js_1.default);
server.use(catch_all_js_1.default);
// --- 5. הפעלת השרת ---
const config = appConfig_js_1.default;
(async () => {
    try {
        await (0, file_utils_js_1.ensureAllAssetsCopied)();
        server.listen(config.port, '0.0.0.0', () => {
            console.log(`🚀 Braingine Server is running on port ${config.port}`);
            console.log(`📁 Static files served from: ${finalImagesPath}`);
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
    }
})();
