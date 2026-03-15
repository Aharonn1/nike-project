import ShoesModel from "./ShoesModel";

// זוהי תוכנית הבנייה המרכזית. המילה export מאפשרת לקבצים אחרים "לייבא" אותה.
export default interface EnrichedShoeModel extends ShoesModel {
    orders: {
        customerName: string;
        total_quantity: number;
    }[];
}