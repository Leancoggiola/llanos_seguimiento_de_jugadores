import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall';
import { isUserLoggedInFailure, isUserLoggedInSuccess } from '../actions/authActions';
import { getRequest } from '../index.js';

import { updateToastData } from '../actions/navbarActions';
import { GET_LOGGED_USER } from '../constants/auth';

// Workers
function* isUserLoggedInWork(action) {
    const { payload } = action;
    try {
        if (payload?.username && payload?.password) {
            const { username, password } = payload;
            const options = {
                url: '/api/user/login',
                method: 'POST',
                data: { username, password },
            };
            const response = yield call(serviceCall, options);
            yield put(isUserLoggedInSuccess(response));
        } else {
            if (document.cookie.replace('jwt=', '')) {
                const options = {
                    url: '/api/user',
                    method: 'GET',
                };
                const response = yield call(serviceCall, options);
                yield put(isUserLoggedInSuccess(response));
            } else {
                yield put(isUserLoggedInFailure(403));
            }
        }
    } catch (e) {
        yield put(updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true }));
        yield put(isUserLoggedInFailure(e));
    }
}

// Watchers
function* isUserLoggedInWatch() {
    yield takeLatest(getRequest(GET_LOGGED_USER), isUserLoggedInWork);
}

export const authSaga = [isUserLoggedInWatch()];
