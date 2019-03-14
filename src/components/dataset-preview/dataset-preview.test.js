import {
  render,
  mount
} from 'enzyme'
import DatasetPreview from './dataset-preview'

describe('dataset preview', () => {
  describe('ui', () => {
    let subject
    beforeEach(() => {
      subject = render(<DatasetPreview dataset_id={'12345'}
        retrieveDatasetPreview={
          jest.fn()
        }
        datasetPreview={
          {
            data: [{
              firstName: 'Joe',
              lastName: 'Smith'
            }, {
              firstName: 'Jane',
              lastName: 'Doe'
            }]
          }
        }
      />)
    })

    test('should render table headers', () => {
      const tableHeaderSelector = '.rt-resizable-header-content'
      expect(subject.find(tableHeaderSelector).get(0).children[0].data).toEqual('firstName')
      expect(subject.find(tableHeaderSelector).get(1).children[0].data).toEqual('lastName')
      expect(subject.find(tableHeaderSelector).length).toEqual(2)
    })

    test('should render table rows', () => {
      const tableElementSelector = '.rt-tr .rt-td'
      expect(subject.find(tableElementSelector).get(0).children[0].data).toEqual('Joe')
      expect(subject.find(tableElementSelector).get(1).children[0].data).toEqual('Smith')

      expect(subject.find(tableElementSelector).get(2).children[0].data).toEqual('Jane')
      expect(subject.find(tableElementSelector).get(3).children[0].data).toEqual('Doe')
    })

    test('download dataset button triggers a download', () => {
      expect(subject.find('.download-dataset').prop('href')).toMatch('/api/v1/dataset/12345/download')
    })
  })

  describe('mounting', () => {
    let retrieveDatasetPreviewMock
    beforeEach(() => {
      retrieveDatasetPreviewMock = jest.fn()
      mount(<DatasetPreview dataset_id={'12345'}
        retrieveDatasetPreview={retrieveDatasetPreviewMock}
        datasetPreview={
          {
            data: []
          }
        }
      />)
    })

    test('retrieveDatasetPreview should be called', () => {
      expect(retrieveDatasetPreviewMock).toBeCalled()
    })
  })
})
