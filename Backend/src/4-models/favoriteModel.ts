class FavoriteModel {
    userId: number;
    shoesId: number;
    constructor(favorite: FavoriteModel) {
        this.userId = favorite.userId;
        this.shoesId = favorite.shoesId;
    }
}
export default FavoriteModel;