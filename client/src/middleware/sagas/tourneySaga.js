import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getTourneysFailure,
    getTourneysSuccess,
    postTourneyFailure,
    postTourneySuccess
} from '../actions/tourneyActions';

import { getRequest } from '../index.js';

import { TOURNEY_GET_TOURNEY_LIST, TOURNEY_POST_NEW_TOURNEY } from '../constants/tourney';
import { updateToastData } from '../actions/navbarActions.js';

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

function* postTourneyWork(action) {
    const { payload: {postBody, resolve} } = action;
    try {
        const options = {
            url: '/api/tournaments/postTournaments',
            method: 'POST',
            data: postBody
        }
        const response = yield call(serviceCall, options)
        yield put(postTourneySuccess(response));
        yield put(getTourneysSuccess([response]));
        yield put(updateToastData({show: true, variant: 'success', message: 'Torneo creado con exito', closeBtn: true}))
        resolve && resolve()
    } catch (e) {
        yield put(postTourneyFailure(e));
        yield put(updateToastData({show: true, variant: 'error', message: e.message, closeBtn: true}))
    }
}

// Watchers
function* getTourneysWatch() {
    yield takeLatest(
        getRequest(TOURNEY_GET_TOURNEY_LIST),
        getTourneysWork
    )
}

function* postTourneyWatch() {
    yield takeLatest(
        getRequest(TOURNEY_POST_NEW_TOURNEY),
        postTourneyWork
    )
}

export const tourneySaga = [
    getTourneysWatch(),
    postTourneyWatch()
]