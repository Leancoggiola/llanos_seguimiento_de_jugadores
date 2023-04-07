import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getTourneysFailure,
    getTourneysSuccess
} from '../actions/tourneyActions';

import { getRequest } from '../index.js';

import { TOURNEY_GET_TOURNEY_LIST } from '../constants/tourney';

// Workers
function* getTourneysWork() {
    try {
        const options = {
            url: '/api/tournaments/getTournaments',
            method: 'GET'
        }
        const response = yield call(serviceCall, options)
        yield put(getTourneysSuccess(response));
    } catch (e) {
        yield put(getTourneysFailure(e.status));
    }
}

// Watchers
function* getTourneysWatch() {
    yield takeLatest(
        getRequest(TOURNEY_GET_TOURNEY_LIST),
        getTourneysWork
    )
}

export const tourneySaga = [
    getTourneysWatch()
]