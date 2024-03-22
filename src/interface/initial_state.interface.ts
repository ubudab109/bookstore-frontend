import { CustomerDataInterface } from "./customer_data.interface";

export interface InitialStateInterface {
    customer_data: CustomerDataInterface;
    isLoggedIn: boolean;
}