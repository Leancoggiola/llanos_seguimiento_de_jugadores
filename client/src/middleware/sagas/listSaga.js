import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getUserListFailure,
    getUserListSuccess,
    postItemToListFailure,
    postItemToListSuccess,
    putChangeItemOnListFailure,
    putChangeItemOnListSuccess,
    deleteItemFromListFailure,
    deleteItemFromListSuccess
} from '../actions/listActions';
import { getRequest } from '../index.js';

import { DELETE_ITEM_FROM_LIST, GET_USER_LIST, POST_ITEM_TO_LIST, PUT_CHANGE_ITEM_ON_LIST } from '../constants/list';

// Workers
function* getUserListWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/list/getList',
            method: 'GET',
            params: {
                user: payload
            }
        }
        const response = yield call(serviceCall, options)
        yield put(getUserListSuccess(response));
    } catch (e) {
        yield put(getUserListFailure(e));
    }
}

function* postItemToListWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/list/postItemToList',
            method: 'POST',
            data: payload
        }
        const response = yield call(serviceCall, options)
        yield put(postItemToListSuccess(response));
    } catch (e) {
        yield put(postItemToListFailure(e));
    }
}

function* putChangeItemOnListWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/list/putChangeItemOnList',
            method: 'PUT',
            data: payload
        }
        const response = yield call(serviceCall, options)
        yield put(putChangeItemOnListSuccess(response));
    } catch (e) {
        yield put(putChangeItemOnListFailure(e));
    }
}

function* deleteItemFromListWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/list/deleteItemFromList',
            method: 'DELETE',
            data: payload
        }
        const response = yield call(serviceCall, options)
        yield put(deleteItemFromListSuccess(response));
    } catch (e) {
        yield put(deleteItemFromListFailure(e));
    }
}

// Watchers
function* getUserListWatch() {
    yield takeLatest(
        getRequest(GET_USER_LIST),
        getUserListWork
    )
}

function* postItemToListWatch() {
    yield takeLatest(
        getRequest(POST_ITEM_TO_LIST),
        postItemToListWork
    )
}

function* putChangeItemOnListWatch() {
    yield takeLatest(
        getRequest(PUT_CHANGE_ITEM_ON_LIST),
        putChangeItemOnListWork
    )
}

function* deleteItemFromListWatch() {
    yield takeLatest(
        getRequest(DELETE_ITEM_FROM_LIST),
        deleteItemFromListWork
    )
}

export const listSaga = [
    getUserListWatch(),
    postItemToListWatch(),
    putChangeItemOnListWatch(),
    deleteItemFromListWatch()
]