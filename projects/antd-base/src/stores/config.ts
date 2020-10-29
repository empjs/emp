// import {langStore, TlangStore} from 'src/stores/lang/langStore'
import {userStore, TuserStore} from 'src/stores/user/userStore'
import {StoresType} from 'src/types'
export interface EmpStoreType {
  // langStore: TlangStore
  userStore: TuserStore
}
const stores: StoresType = {
  // langStore,
  userStore,
}

export default stores
