export enum SourceType {
    SQL = 'SQL',
    PDF = 'PDF',
    DOC = 'DOC'
}

export interface KnowledgeModel {
    id?: number;
    tenantId: string;         // שיוך לחברה
    sourceType: SourceType;   // מקור המידע
    originalContent: string;  // הטקסט עצמו (ה-Chunk)
    embedding: Buffer;        // הוקטור הבינארי (BLOB)
    metadata: string;         // JSON שמכיל פרטים כמו shoesId, price וכו'
    createdAt?: string;
}