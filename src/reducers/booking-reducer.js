import {
    FETCH_USER_BOOKINGS_INIT,
    FETCH_USER_BOOKINGS_SUCCESS,
    FETCH_USER_BOOKINGS_FAIL
} from '../actions/types';

const INITIAL_STATE = {
    data: [],
    errors: [],
    isFetching: false
}

export const userBookingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_BOOKINGS_INIT:
            return { ...state, data: [], erros: [], isFetching: true };
        case FETCH_USER_BOOKINGS_SUCCESS:
            return { ...state, data: action.userBookings, errors: [], isFetching: false};
        case FETCH_USER_BOOKINGS_FAIL:
            return { ...state, errors: [], data: [], isFetching: false};
        default:
            return state;
    }
}