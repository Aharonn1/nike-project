class SizeModel{
    sizeId:number;
    sizeName:string;

    public constructor(size:SizeModel){
        this.sizeId = size.sizeId;
        this.sizeName = size.sizeName;
    }
}

export default SizeModel