import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import { getTeamsRequest } from '../actions/teamActions.js';
import {
    deleteTourneyFailure,
    deleteTourneySuccess,
    getTourneyDetailsFailure,
    getTourneyDetailsRequest,
    getTourneyDetailsSuccess,
    getTourneysFailure,
    getTourneysSuccess,
    postTourneyFailure,
    postTourneySuccess,
    putTourneyDetailsFailure,
    putTourneyDetailsSuccess,
    putTourneyFailure,
    putTourneySuccess,
} from '../actions/tourneyActions';
import { getPlayersRequest } from '../actions/playerActions.js';

import { getRequest } from '../index.js';

import { updateToastData } from '../actions/navbarActions.js';
import {
    TOURNEY_DELETE_NEW_TOURNEY,
    TOURNEY_GET_TOURNEY_DETAILS,
    TOURNEY_GET_TOURNEY_LIST,
    TOURNEY_POST_NEW_TOURNEY,
    TOURNEY_PUT_TOURNEY,
    TOURNEY_PUT_TOURNEY_DETAILS,
} from '../constants/tourney';

// Workers
function* getTourneysWork() {
    try {
        const options = {
            url: '/api/tournaments/getTournaments',
            method: 'GET',
        };
        const response = yield call(serviceCall, options);
        yield put(getTourneysSuccess(response.map((x) => ({ ...x }))));
    } catch (e) {
        yield put(getTourneysFailure(e.status));
    }
}

function* getTourneyDetailsWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: `/api/tournaments/getTournamentDetails/${payload}`,
            method: 'GET',
        };
        const response = yield call(serviceCall, options);
        yield put(getTourneyDetailsSuccess(response));
    } catch (e) {
        yield put(getTourneyDetailsFailure(e.status));
        yield put(updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true }));
    }
}

function* postTourneyWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/tournaments/postTournaments',
            method: 'POST',
            data: body,
        };
        const response = yield call(serviceCall, options);
        yield put(postTourneySuccess(response.result));
        yield put(getTourneysSuccess(response.newData));
        if (response.result.teams.length) yield put(getTeamsRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Torneo creado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(postTourneyFailure(e));
        yield put(updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true }));
    }
}

function* putTourneyWork(action) {
    const {
        payload: { body, resolve, id },
    } = action;
    try {
        const options = {
            url: `/api/tournaments/putTournaments/${id}`,
            method: 'PUT',
            data: body,
        };
        const response = yield call(serviceCall, options);
        yield put(putTourneySuccess(response.result));
        yield put(getTourneysSuccess(response.newData));
        if (response.result.teams.length) yield put(getTeamsRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Torneo editado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(putTourneyFailure(e));
        yield put(updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true }));
    }
}

function* putTourneyDetailsWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: `/api/tournaments/putTournamentsDetails/${payload._id}`,
            method: 'PUT',
            data: payload,
        };
        const response = yield call(serviceCall, options);
        yield put(putTourneyDetailsSuccess(response));
        yield put(getTeamsRequest());
        yield put(getPlayersRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: response,
                closeBtn: true,
            })
        );
        yield put(getTourneyDetailsRequest(payload._id));
    } catch (e) {
        yield put(putTourneyDetailsFailure(e));
        yield put(updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true }));
    }
}

function* deleteTourneyWork(action) {
    const {
        payload: { body, resolve, id },
    } = action;
    try {
        const options = {
            url: `/api/tournaments/deleteTournaments/${id}`,
            method: 'DELETE',
            data: { id: body },
        };
        const response = yield call(serviceCall, options);
        yield put(deleteTourneySuccess(response.result));
        yield put(getTourneysSuccess(response.newData));
        if (response.result.teams.length) yield put(getTeamsRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Torneo eliminado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(deleteTourneyFailure(e));
        yield put(updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true }));
    }
}

// Watchers
function* getTourneysWatch() {
    yield takeLatest(getRequest(TOURNEY_GET_TOURNEY_LIST), getTourneysWork);
}

function* getTourneyDetailsWatch() {
    yield takeLatest(getRequest(TOURNEY_GET_TOURNEY_DETAILS), getTourneyDetailsWork);
}

function* postTourneyWatch() {
    yield takeLatest(getRequest(TOURNEY_POST_NEW_TOURNEY), postTourneyWork);
}

function* putTourneyWatch() {
    yield takeLatest(getRequest(TOURNEY_PUT_TOURNEY), putTourneyWork);
}

function* putTourneyDetailsWatch() {
    yield takeLatest(getRequest(TOURNEY_PUT_TOURNEY_DETAILS), putTourneyDetailsWork);
}

function* deleteTourneyWatch() {
    yield takeLatest(getRequest(TOURNEY_DELETE_NEW_TOURNEY), deleteTourneyWork);
}

export const tourneySaga = [getTourneysWatch(), getTourneyDetailsWatch(), postTourneyWatch(), putTourneyWatch(), putTourneyDetailsWatch(), deleteTourneyWatch()];
