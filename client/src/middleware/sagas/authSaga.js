import { delay, put, takeLatest, call } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall';
import { isUserLoggedInFailure, isUserLoggedInSuccess } from '../actions/authActions';
import { getRequest } from '../index.js';

import jwt_decode from 'jwt-decode';

import { GET_LOGGED_USER } from '../constants/auth';

// Workers
function* isUserLoggedInWork(action) {
    const { payload: { cookies, removeCookie, username, password } } = action;
    try {
        if(username && password) {
            const options = {
                url: '/api/user/login',
                method: 'POST',
                data: {username, password}
            }
            const response = yield call(serviceCall, options)
            yield put(isUserLoggedInSuccess(response));
        } else {
            if(cookies?.jwt) {
                const decodedToken = jwt_decode(cookies.jwt)
                const dateExp = new Date(decodedToken.exp*1000);
                const dateNow = new Date(decodedToken.exp);
                if(dateExp.getTime() < dateNow.getTime()) {
                    removeCookie('jwt')
                    yield put(isUserLoggedInFailure({message: "Not logged"}));
                } else {
                    yield put(isUserLoggedInSuccess(decodedToken.id));
                }
            } else {
                removeCookie('jwt')
                yield put(isUserLoggedInFailure({message: "Not logged"}));
            }
        }
    } catch (e) {
        removeCookie('jwt')
        yield put(isUserLoggedInFailure(e));
    }
}

// Watchers
function* isUserLoggedInWatch() {
    yield takeLatest(
        getRequest(GET_LOGGED_USER),
        isUserLoggedInWork
    )
}

export const authSaga = [
    isUserLoggedInWatch()
]