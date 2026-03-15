class CategoryShoesModel{

    categoryId:number;
    categoryName:string;
    sale:number;

    constructor (category:CategoryShoesModel){
        this.categoryId = category.categoryId;
        this.categoryName = category.categoryName;
        this.sale = category.sale;
    }
}
export default CategoryShoesModel;