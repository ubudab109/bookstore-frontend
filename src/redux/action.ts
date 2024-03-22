import { CustomerDataInterface } from "@/interface/customer_data.interface";

export const SET_CUSTOMER_DATA = 'SET_CUSTOMER_DATA';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';

export const setCustomerData = (item?: CustomerDataInterface) => (
    {
        type: SET_CUSTOMER_DATA,
        payload: item,
    }
);

export const setLoggedIn = (condition: boolean) => (
    {
        type: SET_LOGGED_IN,
        payload: condition,
    }
);
