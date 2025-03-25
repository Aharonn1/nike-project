class CommentModel{
    commentId:number
    userId: number;
    shoesId: number;
    commentText:string;
    commentDate: string = new Date().toISOString().slice(0, 10);
    constructor(commentModel: CommentModel) {
        this.commentId = commentModel.commentId
        this.userId = commentModel.userId;
        this.shoesId = commentModel.shoesId;
        this.commentText = commentModel.commentText;
        this.commentDate = commentModel.commentDate
    }

}
export default CommentModel;