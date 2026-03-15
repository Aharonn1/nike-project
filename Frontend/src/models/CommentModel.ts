// CommentModel.ts
// 💡 תיקון: שינוי ל-interface כדי שיתאים להרחבה
export default interface CommentModel {
    commentId: number;
    userId: number;
    shoesId: number;
    commentText: string;
    commentDate: string;
}

// 💡 ה-interface המורחב, כולל את כל המאפיינים הדרושים
export interface CommentModelWithUser extends CommentModel {
    firstName: string;
    lastName: string;
}