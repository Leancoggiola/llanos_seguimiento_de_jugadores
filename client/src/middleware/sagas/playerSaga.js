import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getPlayersFailure,
    getPlayersSuccess,
    postPlayerFailure,
    postPlayerSuccess,
    deletePlayerFailure,
    deletePlayerSuccess
} from '../actions/playerActions.js';

import { getRequest } from '../index.js';

import { PLAYER_DELETE_NEW_PLAYER, PLAYER_GET_PLAYER_LIST, PLAYER_POST_NEW_PLAYER } from '../constants/player.js';
import { updateToastData } from '../actions/navbarActions.js';

// Workers
function* getPlayersWork() {
    try {
        const options = {
            url: '/api/players/getPlayers',
            method: 'GET'
        }
        const response = yield call(serviceCall, options)
        yield put(getPlayersSuccess(response));
    } catch (e) {
        yield put(getPlayersFailure(e.status));
    }
}

function* postPlayerWork(action) {
    const { payload: {postBody, resolve} } = action;
    try {
        const options = {
            url: '/api/players/postPlayer',
            method: 'POST',
            data: postBody
        }
        const response = yield call(serviceCall, options)
        yield put(postPlayerSuccess(response.result));
        yield put(getPlayersSuccess(response.newData));
        yield put(updateToastData({show: true, variant: 'success', message: 'Equipo creado con exito', closeBtn: true}))
        resolve && resolve()
    } catch (e) {
        yield put(postPlayerFailure(e));
        yield put(updateToastData({show: true, variant: 'error', message: e.message, closeBtn: true}))
    }
}

function* deletePlayerWork(action) {
    const { payload: {postBody, resolve} } = action;
    try {
        const options = {
            url: '/api/players/deletePlayer',
            method: 'DELETE',
            data: {id: postBody}
        }
        const response = yield call(serviceCall, options)
        yield put(deletePlayerSuccess(response.result));
        yield put(getPlayersSuccess(response.newData));
        yield put(updateToastData({show: true, variant: 'success', message: 'Equipo creado con exito', closeBtn: true}))
        resolve && resolve()
    } catch (e) {
        yield put(deletePlayerFailure(e));
        yield put(updateToastData({show: true, variant: 'error', message: e.message, closeBtn: true}))
    }
}

// Watchers
function* getPlayersWatch() {
    yield takeLatest(
        getRequest(PLAYER_GET_PLAYER_LIST),
        getPlayersWork
    )
}

function* postPlayerWatch() {
    yield takeLatest(
        getRequest(PLAYER_POST_NEW_PLAYER),
        postPlayerWork
    )
}

function* deletePlayerWatch() {
    yield takeLatest(
        getRequest(PLAYER_DELETE_NEW_PLAYER),
        deletePlayerWork
    )
}

export const playerSaga = [
    getPlayersWatch(),
    postPlayerWatch(),
    deletePlayerWatch()
]