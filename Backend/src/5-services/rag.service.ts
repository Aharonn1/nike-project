import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
import { ShoeData } from '../4-models/shoes-model.js';
// ייבוא המקור היחיד התקין
import { createEmbedding } from '../2-utils/ai-service';

dotenv.config();

const dbConfig: mysql.ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME,
};

export async function extractAndTransformData(): Promise<string[]> {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM shoes');
        return (rows as ShoeData[]).map(row => 
            `מוצר: ${row.title}. מחיר: ${row.price}. צבע: ${row.color}. תיאור: ${row.description}`
        );
    } catch (error) {
        return [];
    } finally {
        if (connection) await connection.end();
    }
}

export async function vectorizeChunks(chunks: string[]) {
    if (!chunks || chunks.length === 0) return [];
    
    console.log(`\n🧠 מעבד ${chunks.length} פריטים...`);
    
    // שימוש בפונקציה המיובאת בלבד
    const promises = chunks.map(chunk => createEmbedding(chunk));
    const results = await Promise.all(promises);
    
    return results.map((vec, i) => ({
        text: chunks[i],
        vector: vec,
    }));
}

export async function initialRagIndexing() {
    const chunks = await extractAndTransformData();
    return await vectorizeChunks(chunks);
}