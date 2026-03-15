class shoesSizeModel{
    sizeId:number;
    shoesId:number;
    stock:number;

     constructor(size:shoesSizeModel){
        this.sizeId = size.sizeId;
        this.shoesId = size.shoesId;
        this.stock = size.stock;
    }
}

export default shoesSizeModel;