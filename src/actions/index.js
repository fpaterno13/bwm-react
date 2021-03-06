import axios from 'axios';
import authService from '../services/auth-service';
import axiosService from '../services/axios-service';
import {
    FETCH_RENTAL_BY_ID_SUCCESS,
    FETCH_RENTAL_BY_ID_INIT,
    FETCH_RENTALS_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    FETCH_RENTALS_INIT,
    FETCH_RENTALS_FAIL,
    FETCH_USER_BOOKINGS_FAIL,
    FETCH_USER_BOOKINGS_SUCCESS,
    FETCH_USER_BOOKINGS_INIT
} from './types';

const axiosInstance = axiosService.getInstance();

const fetchRentalByIdInit = () => {
    return {
        type: FETCH_RENTAL_BY_ID_INIT
    }
}

const fetchRentalByIdSuccess = (rental) => {
    return {
        type: FETCH_RENTAL_BY_ID_SUCCESS,
        rental
    }
}

const fetchRentalsSuccess = (rentals) => {
    return {
        type: FETCH_RENTALS_SUCCESS,
        rentals
    }
}

const fetchRentalsInit = () => {
    return {
        type: FETCH_RENTALS_INIT
    }
}

const fetchRentalsFail = (errors) => {
    return {
        type: FETCH_RENTALS_FAIL,
        errors
    }
}

//3 -1. action que devuelve las rentals. carga la data
export const fetchRentals = (city) => {
    const url = city ? `/api/v1/rentals?city=${city}` : '/api/v1/rentals';

    return dispatch => {
        dispatch(fetchRentalsInit());

        axiosInstance.get(url)
            .then(res => res.data)
            .then(rentals => dispatch(fetchRentalsSuccess(rentals)))
            .catch(({ response }) => dispatch(fetchRentalsFail(response.data.errors)))
    }
}

export const fetchRentalById = (rentalId) => {
    return function (dispatch) {
        dispatch(fetchRentalByIdInit());

        axiosInstance.get(`/api/v1/rentals/${rentalId}`)
            .then(res => res.data)
            .then(rental => dispatch(fetchRentalByIdSuccess(rental))
            );
    }
}

export const createRental = (rentalData) => {
    return axiosInstance.post('/api/v1/rentals', rentalData).then(
        (res) => {
            return res.data;
        },
        (err) => {
            return Promise.reject(err.response.data.errors);
        }
    )
}

export const register = (userData) => {
    return axios.post('api/v1/users/register', userData).then(
        (res) => {
            return res.data;
        },
        (err) => {
            return Promise.reject(err.response.data.errors);
        }
    )
}

const fetchUserBookingsInit = () => {
    return {
        type: FETCH_USER_BOOKINGS_INIT
    }
}

const fetchUserBookingsSuccess = (userBookings) => {
    return {
        type: FETCH_USER_BOOKINGS_SUCCESS,
        userBookings
    }
}

const fetchUserBookingsFail = (errors) => {
    return {
        type: FETCH_USER_BOOKINGS_FAIL,
        errors
    }
}

export const fetchUserBookings = () => {
    return dispatch => {
        dispatch(fetchUserBookingsInit());

        axiosInstance.get('/api/v1/bookings/manage')
            .then(res => res.data)
            .then(userBookings => dispatch(fetchUserBookingsSuccess(userBookings)))
            .catch(({ response }) => dispatch(fetchUserBookingsFail(response.data.errors)))
    }
}

const loginSuccess = () => {
    const username = authService.getUsername();
    return {
        type: LOGIN_SUCCESS,
        username
    }
}

const loginFailure = (errors) => {
    return {
        type: LOGIN_FAILURE,
        errors
    }
}

export const checkAuthState = () => {
    return dispatch => {
        if (authService.isAuthenticated()) {
            dispatch(loginSuccess());
        }
    }
}

export const login = (userData) => {
    return dispatch => {
        return axios.post('api/v1/users/auth', userData)
            .then(res => res.data)
            .then(token => {
                authService.saveToken(token);
                dispatch(loginSuccess());
            })
            .catch((error) => {
                dispatch(loginFailure(error.response.data.errors));
            })
    }
}

export const logout = () => {
    authService.invalidateUser();

    return {
        type: LOGOUT
    }
}

export const createBooking = (booking) => {
    return axiosInstance.post('/api/v1/bookings', booking)
        .then(res => res.data)
        .catch(({ response }) => Promise.reject(response.data.errors));
}

export const getUserRentals = () => {
    return axiosInstance.get('/api/v1/rentals/manage').then(
        (res) => {
            return res.data;
        },
        (err) => {
            return Promise.reject(err.response.data.errors);
        }
    )
}

export const deleteRental = (rentalId) => {
    return axiosInstance.delete(`/api/v1/rentals/${rentalId}`).then(
            res => res.data,
            err => Promise.reject(err.response.data.errors))
}
