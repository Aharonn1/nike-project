class CategoryClothingsModel{

    categoryId:number;
    categoryName:string

    constructor (category:CategoryClothingsModel){
        this.categoryId = category.categoryId;
        this.categoryName = category.categoryName;
    }
}

export default CategoryClothingsModel;