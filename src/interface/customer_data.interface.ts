import { CustomerOrderInterface } from "./customer_order.interface";

export interface CustomerDataInterface {
    id?: number;
    name?: string;
    username?: string;
    points?: number;
    orders?: Array<CustomerOrderInterface>;
    processOrderCount?: number;
}