import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { tourneySaga } from './tourneySaga';
import { teamSaga } from './teamSaga';

export default function* rootSagas() {
    yield all([
        ...tourneySaga,
        ...authSaga,
        ...teamSaga
    ])
}