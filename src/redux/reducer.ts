import { InitialStateInterface } from "@/interface/initial_state.interface";
import { SET_CUSTOMER_DATA, SET_LOGGED_IN } from "./action";
import { CustomerDataInterface } from "@/interface/customer_data.interface";

const initialState: InitialStateInterface = {
    customer_data: {
        id: 0,
        name: '',
        username: '',
        points: 0,
        orders: [],
        processOrderCount: 0
    },
    isLoggedIn: false,
};

const rootReducer = (state = initialState, action: { type: string; payload: any}) => {
    switch(action.type) {
        case SET_CUSTOMER_DATA:
            return {
                ...state,
                customer_data: action.payload,
            }
        case SET_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: action.payload,
            }
        default:
            return state;
    }
};

export default rootReducer;
