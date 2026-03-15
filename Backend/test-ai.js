// test-ai.js
async function testServer() {
    console.log("🚀 שולח שאלה לשרת...");

    try {
const response = await fetch("http://127.0.0.1:4050/api/ai/ask", {
        method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: "האם הנעליים האלו טובות לריצה בגשם?",
                description: "נעלי הרים מדגם Ultra-X. עשויות מעור הפוך, סוליה קשיחה לטיפוס, לא עמידות במים. מתאימות למדבר."
            })
        });

        const data = await response.json();
        console.log("✅ תשובה מה-AI:");
        console.log("------------------------------------------------");
        console.log(data.answer);
        console.log("------------------------------------------------");

    } catch (error) {
        console.error("❌ שגיאה:", error.message);
    }
}

testServer();