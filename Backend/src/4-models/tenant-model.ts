export interface TenantModel {
    tenantId: string;      // למשל: 'nike-il'
    companyName: string;   // למשל: 'נייקי ישראל'
    apiKey: string;        // המפתח הסודי שלהם
    isActive: boolean;
    createdAt?: string;
}