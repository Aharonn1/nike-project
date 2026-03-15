// src/interfaces.ts

export interface Product {
    productId: string;
    name: string;
    // זהו משתנה ה-1000 המילים שלך
    fullDescription: string;
}

export interface AskProductRequest {
    question: string;
    productId: string; 
}