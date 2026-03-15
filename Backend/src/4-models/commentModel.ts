// src/4-models/commentModel.ts

class CommentModel {

    commentId?: number; // הפוך ללא-חובה
    userId: number;
    shoesId: number;
    commentText: string;
    commentDate: string; // אל תאתחל כאן

    constructor(commentModel: CommentModel) {
        this.commentId = commentModel.commentId
        this.userId = commentModel.userId;
        this.shoesId = commentModel.shoesId;
        this.commentText = commentModel.commentText;
        
        // הגדרת תאריך אוטומטית רק אם הוא לא סופק:
        if (commentModel.commentDate) {
            this.commentDate = commentModel.commentDate;
        } else {
            this.commentDate = new Date().toISOString().slice(0, 10);
        }
    }
}
export default CommentModel;