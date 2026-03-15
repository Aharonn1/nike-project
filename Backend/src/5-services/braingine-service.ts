import dal from "../2-utils/dal.js";
import { createEmbedding } from "../2-utils/ai-service.js";

class BraingineService {

    public async addKnowledge(): Promise<void> {
        try {
            const sqlSelect = "SELECT shoesId, title, description, color, price FROM shoes";
            const shoes = await dal.execute(sqlSelect);

            if (!shoes || shoes.length === 0) return;

            console.log(`🚀 מעבד ${shoes.length} נעליים...`);

            for (const shoe of shoes) {
                const contentToVectorize = `מוצר: ${shoe.title}. תיאור: ${shoe.description}. צבע: ${shoe.color}.`.trim();

                // יצירת הוקטור - הפונקציה עכשיו מובטחת להחזיר מערך מספרים
                const vector = await createEmbedding(contentToVectorize);

                // המרה לפורמט JSON STRING תקין עבור עמודת ה-VECTOR או ה-JSON ב-MySQL
                const vectorJson = JSON.stringify(vector);

                // עדכון טבלת shoes
                const sqlUpdate = "UPDATE shoes SET embedding = ? WHERE shoesId = ?";
                
                // שליחת ה-JSON התקין
                await dal.execute(sqlUpdate, [vectorJson, shoe.shoesId]);

                console.log(`✅ עודכן וקטור תקין לנעל: ${shoe.title}`);
            }
        } catch (error: any) {
            console.error("❌ שגיאה ב-Ingest:", error.message);
            throw error;
        }
    }
}

const braingineService = new BraingineService();
export default braingineService;