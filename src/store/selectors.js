export const getDataSetList = state => state.datasetReducer.datasets
export const getFacetList = state => state.datasetReducer.facets
export const getTotalNumberOfDatasets = state => state.datasetReducer.total
export const getDataSetError = state => state.datasetReducer.datasetError
export const getDataSet = state => state.datasetReducer.dataset
export const getDataSetPreview = state => state.presentation.dataset_preview
export const determineIfLoading = state => state.presentation.isLoading
export const lastLoginAttemptFailed = state => state.presentation.lastLoginAttemptFailed
