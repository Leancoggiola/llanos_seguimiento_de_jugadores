import { call, put, takeLatest } from 'redux-saga/effects';

import { serviceCall } from '../../config/serviceCall.js';
import {
    getTeamsFailure,
    getTeamsSuccess,
    postTeamFailure,
    postTeamSuccess
} from '../actions/teamActions.js';

import { getRequest } from '../index.js';

import { TEAM_GET_TEAM_LIST, TEAM_POST_NEW_TEAM } from '../constants/team.js';

// Workers
function* getTeamsWork() {
    try {
        const options = {
            url: '/api/teams/getTeams',
            method: 'GET'
        }
        const response = yield call(serviceCall, options)
        yield put(getTeamsSuccess(response));
    } catch (e) {
        yield put(getTeamsFailure(e.status));
    }
}

function* postTeamWork(action) {
    const { payload } = action;
    try {
        const options = {
            url: '/api/teams/postTeam',
            method: 'POST',
            data: payload
        }
        const response = yield call(serviceCall, options)
        yield put(postTeamSuccess(response));
    } catch (e) {
        yield put(postTeamFailure(e));
    }
}

// Watchers
function* getTeamsWatch() {
    yield takeLatest(
        getRequest(TEAM_GET_TEAM_LIST),
        getTeamsWork
    )
}

function* postTeamWatch() {
    yield takeLatest(
        getRequest(TEAM_POST_NEW_TEAM),
        postTeamWork
    )
}

export const teamSaga = [
    getTeamsWatch(),
    postTeamWatch()
]