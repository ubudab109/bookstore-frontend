import { BookDataInterface } from "./book_data.interface";

export interface CustomerOrderInterface {
    id: number;
    ordered_at: string;
    quantity: number;
    status: string;
    total: number;
    book?: BookDataInterface
}