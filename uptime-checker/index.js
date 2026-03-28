const axios = require('axios');
const URL = 'http://shoes-shop-pro.com'; 

async function checkUptime() {
    try {
        const response = await axios.get(URL);
        console.log(`[${new Date().toISOString()}] Status: UP (Code: ${response.status})`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ALERT: Site is DOWN! Error: ${error.message}`);
    }
}

checkUptime();
setInterval(checkUptime, 5 * 60 * 1000); // בדיקה כל 5 דקות