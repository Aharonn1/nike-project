"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_service_js_1 = require("../2-utils/ai-service.js");
const tasks_service_js_1 = __importDefault(require("../4-models/tasks-service.js"));
const ai_search_logic_js_1 = require("../5-services/ai-search-logic.js");
const router = express_1.default.Router();
function formatProductForAI(shoe) {
    return `Product Details: Name: ${shoe.title}, Price: ${shoe.price}, Color: ${shoe.color}, Description: ${shoe.description}`;
}
router.post("/ask-product", async (request, response, next) => {
    try {
        const { question, productId } = request.body;
        const productData = await tasks_service_js_1.default.getOneProduct(productId);
        if (!productData)
            return response.json({ answer: "מוצר לא נמצא." });
        const contextString = formatProductForAI(productData);
        // התיקון: איחוד השאילתה למחרוזת אחת עבור ה-SDK
        const finalPrompt = `Context: ${contextString}\nQuestion: ${question}`;
        const fullResponse = await (0, ai_service_js_1.chatWithGemini)(finalPrompt);
        response.json(fullResponse);
    }
    catch (err) {
        next(err);
    }
});
router.post("/search", async (request, response, next) => {
    try {
        const { question } = request.body;
        console.log("🚀 Search request for:", question);
        const fullResponse = await (0, ai_search_logic_js_1.searchAllShoes)(question);
        // שליחת 'answer' כדי להתאים לפרונט
        response.json({
            answer: fullResponse.answer || fullResponse.text || "מצאתי נעליים עבורך:",
            shoes: fullResponse.shoes || []
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
