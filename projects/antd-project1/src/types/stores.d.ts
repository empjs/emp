import {TlangStore} from 'src/stores/langStore'
import {EmpStoreType} from '@emp-antd/base/stores/config'

export interface StoreTypes extends EmpStoreType {
  langStore: TlangStore
}
