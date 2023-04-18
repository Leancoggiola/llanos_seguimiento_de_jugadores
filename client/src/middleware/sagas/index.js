import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { playerSaga } from './playerSaga';
import { teamSaga } from './teamSaga';
import { tourneySaga } from './tourneySaga';

export default function* rootSagas() {
    yield all([
        ...authSaga,
        ...playerSaga,
        ...teamSaga,
        ...tourneySaga
    ])
}