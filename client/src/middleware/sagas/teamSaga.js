import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getTeamsFailure,
    getTeamsSuccess,
    postTeamFailure,
    postTeamSuccess,
    deleteTeamFailure,
    deleteTeamSuccess,
    putTeamSuccess,
    putTeamFailure,
} from '../actions/teamActions.js';
import { getPlayersRequest } from '../actions/playerActions.js';

import { getRequest } from '../index.js';

import {
    TEAM_DELETE_NEW_TEAM,
    TEAM_GET_TEAM_LIST,
    TEAM_POST_NEW_TEAM,
    TEAM_PUT_TEAM,
} from '../constants/team.js';
import { updateToastData } from '../actions/navbarActions.js';

// Workers
function* getTeamsWork() {
    try {
        const options = {
            url: '/api/teams/getTeams',
            method: 'GET',
        };
        const response = yield call(serviceCall, options);
        yield put(getTeamsSuccess(response));
    } catch (e) {
        yield put(getTeamsFailure(e.status));
    }
}

function* postTeamWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/teams/postTeam',
            method: 'POST',
            data: body,
        };
        const response = yield call(serviceCall, options);
        yield put(postTeamSuccess(response.result));
        yield put(getTeamsSuccess(response.newData));
        if (response.result.players.length) yield put(getPlayersRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Equipo creado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(postTeamFailure(e));
        yield put(
            updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true })
        );
    }
}

function* putTeamWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/teams/putTeam',
            method: 'PUT',
            data: body,
        };
        const response = yield call(serviceCall, options);
        debugger;
        yield put(putTeamSuccess(response.result));
        yield put(getTeamsSuccess(response.newData));
        if (response.result.players.length) yield put(getPlayersRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Equipo editado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(putTeamFailure(e));
        yield put(
            updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true })
        );
    }
}

function* deleteTeamWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/teams/deleteTeam',
            method: 'DELETE',
            data: { id: body },
        };
        const response = yield call(serviceCall, options);
        yield put(deleteTeamSuccess(response.result));
        yield put(getTeamsSuccess(response.newData));
        if (response.result.players.length) yield put(getPlayersRequest());
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Equipo eliminado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(deleteTeamFailure(e));
        yield put(
            updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true })
        );
    }
}

// Watchers
function* getTeamsWatch() {
    yield takeLatest(getRequest(TEAM_GET_TEAM_LIST), getTeamsWork);
}

function* postTeamWatch() {
    yield takeLatest(getRequest(TEAM_POST_NEW_TEAM), postTeamWork);
}

function* putTeamWatch() {
    yield takeLatest(getRequest(TEAM_PUT_TEAM), putTeamWork);
}

function* deleteTeamWatch() {
    yield takeLatest(getRequest(TEAM_DELETE_NEW_TEAM), deleteTeamWork);
}

export const teamSaga = [getTeamsWatch(), postTeamWatch(), putTeamWatch(), deleteTeamWatch()];
