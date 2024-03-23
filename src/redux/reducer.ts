import { InitialStateInterface } from "@/interface/initial_state.interface";
import { SET_CUSTOMER_DATA, SET_LOGGED_IN } from "./action";
import { SetCustomerDataAction, SetLoggedInAction } from "@/interface/redux.interface";

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

type ActionTypes = SetCustomerDataAction | SetLoggedInAction;

const rootReducer = (state = initialState, action: ActionTypes) => {
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
