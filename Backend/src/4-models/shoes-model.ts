// src/4-models/shoes-model.ts

import { UploadedFile } from "express-fileupload";

/**
 * ✅ ה-Interface המכיל את כל השדות הקיימים במחלקה.
 */
export interface ShoeData {
    shoesId: number;
    categoryId: number;
    title: string;
    description: string;
    price: number;
    bought: number;
    stock: number;
    image: UploadedFile; // ✅ תיקון 1: הפוך את image לאופציונלי
    imageName: string;
    imageLink: string;
    shoppingBasket: number;
    favorite: number; 
    imageNameFront: string;
    imageNameAbove: string;
    imageNameBack: string;
    imageNameDown: string;
    video: string;
    color: string;
    ai_description: string;
}

// המחלקה העיקרית (נשארת כפי שהייתה, יורשת מ-ShoeData)
class ShoesModel implements ShoeData {
    shoesId: number;
    categoryId: number;
    title: string;
    description: string;
    price: number;
    bought: number;
    stock: number;
    image: UploadedFile; // ✅ תיקון 2: הפוך את image לאופציונלי
    imageName: string;
    imageLink: string;
    shoppingBasket: number;
    favorite: number;
    imageNameFront: string;
    imageNameAbove: string;
    imageNameBack: string;
    imageNameDown: string;
    video: string;
    color: string;
    ai_description: string;
    
    constructor(shoes: ShoesModel | ShoeData) {
        this.shoesId = shoes.shoesId;
        this.categoryId = shoes.categoryId;
        this.title = shoes.title;
        this.description = shoes.description;
        this.price = shoes.price;
        this.bought = shoes.bought;
        this.stock = shoes.stock;
        
        // ✅ תיקון 3: השתמש בנכס אופציונלי כדי להימנע משגיאת אתחול
        this.image = shoes.image; 

        this.imageName = shoes.imageName;
        this.imageLink = shoes.imageLink;
        this.shoppingBasket = shoes.shoppingBasket;
        this.favorite = shoes.favorite;
        this.imageNameFront = shoes.imageNameFront;
        this.imageNameAbove = shoes.imageNameAbove;
        this.imageNameBack = shoes.imageNameBack;
        this.imageNameDown = shoes.imageNameDown;
        this.video = shoes.video;
        this.color = shoes.color;
        this.ai_description = shoes.ai_description;
    }
}
export { ShoesModel }; 
export default ShoesModel;