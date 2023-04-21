import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getPlayersFailure,
    getPlayersSuccess,
    postPlayerFailure,
    postPlayerSuccess,
    deletePlayerFailure,
    deletePlayerSuccess,
    putPlayerSuccess,
    putPlayerFailure,
} from '../actions/playerActions.js';
import { getPlayersRequest } from '../actions/playerActions.js';

import { getRequest } from '../index.js';

import {
    PLAYER_DELETE_NEW_PLAYER,
    PLAYER_GET_PLAYER_LIST,
    PLAYER_POST_NEW_PLAYER,
    PLAYER_PUT_PLAYER,
} from '../constants/player.js';
import { updateToastData } from '../actions/navbarActions.js';

// Workers
function* getPlayersWork() {
    try {
        const options = {
            url: '/api/players/getPlayers',
            method: 'GET',
        };
        const response = yield call(serviceCall, options);
        yield put(getPlayersSuccess(response));
    } catch (e) {
        yield put(getPlayersFailure(e.status));
    }
}

function* postPlayerWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/players/postPlayer',
            method: 'POST',
            data: body,
        };
        const response = yield call(serviceCall, options);
        yield put(postPlayerSuccess(response.result));
        yield put(getPlayersSuccess(response.newData));
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Jugador creado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(postPlayerFailure(e));
        yield put(
            updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true })
        );
    }
}

function* putPlayerWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/players/putPlayer',
            method: 'PUT',
            data: body,
        };
        const response = yield call(serviceCall, options);
        debugger;
        yield put(putPlayerSuccess(response.result));
        yield put(getPlayersSuccess(response.newData));
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Jugador editado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(putPlayerFailure(e));
        yield put(
            updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true })
        );
    }
}

function* deletePlayerWork(action) {
    const {
        payload: { body, resolve },
    } = action;
    try {
        const options = {
            url: '/api/players/deletePlayer',
            method: 'DELETE',
            data: { id: body },
        };
        const response = yield call(serviceCall, options);
        yield put(deletePlayerSuccess(response.result));
        yield put(getPlayersSuccess(response.newData));
        yield put(
            updateToastData({
                show: true,
                variant: 'success',
                message: 'Jugador eliminado con exito',
                closeBtn: true,
            })
        );
        resolve && resolve();
    } catch (e) {
        yield put(deletePlayerFailure(e));
        yield put(
            updateToastData({ show: true, variant: 'error', message: e.message, closeBtn: true })
        );
    }
}

// Watchers
function* getPlayersWatch() {
    yield takeLatest(getRequest(PLAYER_GET_PLAYER_LIST), getPlayersWork);
}

function* postPlayerWatch() {
    yield takeLatest(getRequest(PLAYER_POST_NEW_PLAYER), postPlayerWork);
}

function* putPlayerWatch() {
    yield takeLatest(getRequest(PLAYER_PUT_PLAYER), putPlayerWork);
}

function* deletePlayerWatch() {
    yield takeLatest(getRequest(PLAYER_DELETE_NEW_PLAYER), deletePlayerWork);
}

export const playerSaga = [
    getPlayersWatch(),
    postPlayerWatch(),
    putPlayerWatch(),
    deletePlayerWatch(),
];
