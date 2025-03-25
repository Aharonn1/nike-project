import { UploadedFile } from "express-fileupload";

class ShoesModel{
    shoesId:number;
    categoryId:number;
    title:string;
    description:string;
    price:number;
    bought:number;
    stock:number;
    image:UploadedFile;
    imageName:string;
    imageLink:string;
    shoppingBasket:number;
    favorite:number;
    imageNameFront:string;
    imageNameAbove:string;
    imageNameBack:string;
    imageNameDown:string;
    video:string;

    constructor(shoes:ShoesModel){
        this.shoesId = shoes.shoesId;
        this.categoryId = shoes.categoryId;
        this.title = shoes.title;
        this.description = shoes.description;
        this.price = shoes.price;
        this.bought = shoes.bought;
        this.stock = shoes.stock;
        this.image = shoes.image;
        this.imageName = shoes.imageName;
        this.imageLink = shoes.imageLink
        this.shoppingBasket = shoes.shoppingBasket;
        this.favorite = shoes.favorite;
        this.imageNameFront = shoes.imageNameFront;
        this.imageNameAbove = shoes.imageNameAbove;
        this.imageNameBack = shoes.imageNameBack;
        this.imageNameDown = shoes.imageNameDown;
        this.video = shoes.video;
    }
}

export default ShoesModel;