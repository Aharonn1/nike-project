import axios from "axios";
import appConfig from "../Utils/AppConfig";

// הגדרת טיפוס ה-Response הצפוי
interface AiResponse {
    answer: string;
    context: any;
    shoes?: any[]; // הוספת שדה הנעליים כדי למנוע שגיאות טיפוס
}

class AiService {

    // ✅ 1. מנגנון זיכרון
    private lastProductsList: string[] = [];

    /**
     * עדכון הזיכרון על בסיס שמות נעליים בתוך כוכביות כפולות
     */
    private updateMemory(aiResponse: string): void {
        if (!aiResponse) return;
        
        const matches = aiResponse.match(/\*\*([^*]+?)\*\*/g);

        if (matches) {
            this.lastProductsList = matches.map(m => m.replace(/\*\*/g, '').trim());
            console.log("🧠 AI Memory Updated. Last shoes found:", this.lastProductsList);
        } else {
            this.lastProductsList = [];
        }
    }

    /**
     * פונקציה ראשית לשליחת שאלה
     */
    public async askQuestion(
        question: string,
        productId?: number,
        context?: any
    ): Promise<AiResponse> {

        let url: string;
        let body: any;
        let finalQuestion = question;

        // 2. לוגיקת שילוב (Fusion Logic) - הוספת קונטקסט לשאלות המשך
        if (!productId || productId === 0) {
            const lowerCaseQuestion = question.toLowerCase();
            const comparisonKeywords = [
                'them', 'those', 'which one', 'compare', 'better', 'of these',
                'cheapest', 'zippest', 'low', 'high', 'price', 'מחיר', 'זול', 'יקר', 'מהיר',
                'color', 'size', 'black', 'white', 'red', 'blue', 'שחור', 'לבן', 'אדום', 'כחול', 'צבע', 'מידה'
            ];

            const isFollowUpQuestion = comparisonKeywords.some(keyword => lowerCaseQuestion.includes(keyword));

            if (isFollowUpQuestion && this.lastProductsList.length > 0) {
                const shoeNames = this.lastProductsList.join(', ');
                finalQuestion = `Based on the following shoes: [${shoeNames}], ${question}`;
                console.log("🔗 Follow-up detected. Modified Prompt:", finalQuestion);
            }
        }

        // 3. קביעת Endpoint
        if (productId && productId > 0) {
            url = appConfig.askProductUrl;
            body = { question: finalQuestion, productId, context: context || {} };
        } else {
            url = appConfig.globalSearchUrl;
            body = { question: finalQuestion };
        }

        try {
            // 🔥 הדפסה לפני שליחה - וודא שאתה רואה את זה בקונסול!
            console.log(`📡 Sending Request to: ${url}`, body);

            const response = await axios.post(url, body);

            // 🔍 הדפסה של מה שחזר מהשרת - קריטי לבדיקה
            console.log("📥 Raw Response from Server:", response.data);

            // נירמול התשובה: מחפשים answer או text
            const extractedAnswer = response.data.answer || response.data.text || "";
            const extractedShoes = response.data.shoes || [];

            if (extractedAnswer) {
                this.updateMemory(extractedAnswer);
            }

            // החזרת הנתונים בפורמט שהצ'אט מצפה לו
            return {
                answer: extractedAnswer,
                context: response.data.context || {},
                shoes: extractedShoes // מעביר את רשימת הנעליים להצגה באתר
            } as AiResponse;

        } catch (error) {
            console.error("❌ AI Service Frontend Error:", error);
            
            const errorMessage = axios.isAxiosError(error)
                ? `שגיאת תקשורת: ${error.response?.data?.error || error.message}`
                : "מצטער, הייתה שגיאה לא צפויה.";

            return {
                answer: errorMessage,
                context: {}
            };
        }
    }
}

const aiService = new AiService();
export default aiService;