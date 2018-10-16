import { takeEvery } from 'redux-saga/effects'
import { RETRIEVE_DATA_LIST, selectDataList } from '../actions'
import apiInvoker from './api-invoker'

export default function * theRealDatasetSaga () {
  yield takeEvery(RETRIEVE_DATA_LIST, apiInvoker('/api/fetchDatasetSummaries', selectDataList))
}
