import { UploadedFile } from "express-fileupload";

class ClothingModel{
    clothingId:number;
    categoryId:number;
    description:string;
    price:number;
    title:string;
    image:UploadedFile;
    imageName:string;

    constructor(clothing:ClothingModel){
        this.clothingId = clothing.clothingId;
        this.categoryId = clothing.categoryId;
        this.description = clothing.description;
        this.title = clothing.title;
        this.price = clothing.price;
        this.image = clothing.image;
        this.imageName = clothing.imageName;
    }
}

export default ClothingModel;