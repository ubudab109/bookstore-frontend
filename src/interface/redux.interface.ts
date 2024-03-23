import { CustomerDataInterface } from "@/interface/customer_data.interface";
import { SET_CUSTOMER_DATA, SET_LOGGED_IN } from "@/redux/action";

export interface SetCustomerDataAction {
    type: typeof SET_CUSTOMER_DATA;
    payload: CustomerDataInterface;
}

export interface SetLoggedInAction {
    type: typeof SET_LOGGED_IN;
    payload: boolean;
}