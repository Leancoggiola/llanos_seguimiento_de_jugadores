import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { tourneySaga } from './tourneySaga';
import { searchSaga } from './searchSaga';

export default function* rootSagas() {
    yield all([
        ...tourneySaga,
        ...authSaga,
        ...searchSaga
    ])
}