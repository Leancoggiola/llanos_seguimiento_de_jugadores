import { put, call, takeLatest} from 'redux-saga/effects';

import { getRequest } from '../index.js';
import { 
    getContentSearchFailure, 
    getContentSearchSuccess,
    getOverviewDetailsFailure,
    getOverviewDetailsSuccess
} from '../actions/searchActions';
import { serviceCall } from '../../config/serviceCall.js'

import { GET_CONTENT_SEARCH, GET_CONTENT_DETAILS } from '../constants/search';

// Workers
function* getContentSearchWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/imdb/getContent',
            method: 'GET',
            params: {
                title: payload
            }
        }
        const response = yield call(serviceCall, options)
        yield put(getContentSearchSuccess(response));
    } catch (e) {
        yield put(getContentSearchFailure(e));
    }
}

function* getOverviewDetailsWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/imdb/getOverviewDetails',
            method: 'GET',
            params: {
                tconst: payload,
                currentCountry: 'ES'
            }
        }
        const response = yield call(serviceCall, options)
        yield put(getOverviewDetailsSuccess(response));
    } catch (e) {
        yield put(getOverviewDetailsFailure(e));
    }
}

// Watchers
function* getContentSearchWatch() {
    yield takeLatest(
        getRequest(GET_CONTENT_SEARCH),
        getContentSearchWork
    )
}

function* getOverviewDetailsWatch() {
    yield takeLatest(
        getRequest(GET_CONTENT_DETAILS),
        getOverviewDetailsWork
    )
}

export const searchSaga = [
    getContentSearchWatch(),
    getOverviewDetailsWatch()
]