import {
  executeFreestyleQuery,
  setQuerySuccess,
  setQueryInProgress,
  setQueryFailure,
  cancelFreestyleQuery,
  setQueryText
} from '../actions'
import freestyleQuerySaga from './freestyle-query-saga'
import mockAxios from 'axios'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import oneTrueReducer from '../reducers'

jest.mock('axios')

const ERROR_MESSAGE_CONSTANT = 'Query failure.  There may be a syntax issue.'

const setUpSagaMiddleware = reducer => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(reducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(freestyleQuerySaga)

  return store
}

describe('freestyle-query-saga', () => {
  let store
  const actionTrackingReducer = (state = [], action) => {
    return [...state, action]
  }

  const queryText = 'select * from lettuce'
  const queryData = [{ hello: "world" }, { hello: "columbus" }]
  const response = {
    status: 200,
    data: queryData
  }

  beforeEach(() => {
    window.API_HOST = 'http://example.com/'

    mockAxios.CancelToken = { source: () => ({ token: {} }) }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('success', () => {
    beforeEach(() => {
      mockAxios.post.mockImplementationOnce(() => (response))
      store = setUpSagaMiddleware(actionTrackingReducer)
      store.dispatch(executeFreestyleQuery(queryText))
    })

    it('calls multiple query api with query', () => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/v1/query', queryText, {
        cancelToken: expect.any(Object),
        baseURL: window.API_HOST,
        withCredentials: true,
        headers: { "Content-Type": "text/plain" },
        validateStatus: false
      })
    })

    it('dispatches a QUERY_DATASET_SUCCEEDED event', () => {
      expect(store.getState()).toContainEqual(setQuerySuccess(queryData))
    })

    it('dispatches a QUERY_DATASET_IN_PROGRESS event', () => {
      expect(store.getState()).toContainEqual(setQueryInProgress({ token: {} }))
    })
  })

  describe('failure', () => {
    beforeEach(() => {
      store = setUpSagaMiddleware(actionTrackingReducer)
    })

    it('dispatches a QUERY_DATASET_FAILED event based on 400 code', () => {
      const data = { message: "bad things happened" }
      const response = {
        status: 400,
        data
      }
      mockAxios.post.mockImplementationOnce(() => (response))

      store.dispatch(executeFreestyleQuery(queryText))

      expect(store.getState()).toContainEqual(setQueryFailure(ERROR_MESSAGE_CONSTANT))
    })

    it('dispatches a QUERY_DATASET_FAILED event on a catastrophic failure', () => {
      const errorMsg = "It's all over"

      mockAxios.post.mockImplementationOnce(() => { throw new Error(errorMsg) })

      store.dispatch(executeFreestyleQuery(queryText))

      expect(store.getState()).toContainEqual(setQueryFailure(ERROR_MESSAGE_CONSTANT))
    })
  })

  describe('without provided query text', () => {
    const queryTextInStore = 'select * from cabbage'
    beforeEach(() => {
      store = setUpSagaMiddleware(oneTrueReducer)

      mockAxios.post.mockImplementationOnce(() => (response))

      store.dispatch(setQueryText(queryTextInStore))
      store.dispatch(executeFreestyleQuery())
    })

    it('calls multiple query api with the query from store', () => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/v1/query', queryTextInStore, {
        cancelToken: expect.any(Object),
        baseURL: window.API_HOST,
        withCredentials: true,
        headers: { "Content-Type": "text/plain" },
        validateStatus: false
      })
    })
  })
})

describe('freestyle-query-saga QUERY_DATASET_CANCELLED event', () => {
  let store
  let cancelMock

  beforeEach(() => {
    store = setUpSagaMiddleware(oneTrueReducer)

    mockAxios.CancelToken = { source: () => ({ token: {} }) }

    cancelMock = jest.fn()
    const cancelToken = { token: {}, cancel: cancelMock }

    store.dispatch(setQueryInProgress(cancelToken))
    store.dispatch(cancelFreestyleQuery())
  })

  it('cancels the query', () => {
    expect(cancelMock).toHaveBeenCalled()
  })
})
