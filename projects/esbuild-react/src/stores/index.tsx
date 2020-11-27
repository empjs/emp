import React, {createContext, useContext} from 'react'
import {useLocalStore} from 'mobx-react-lite'
import configStores, {EmpStoreType} from 'src/stores/config'
import {StoresType} from 'src/types'

type TstoreProviderProps = {
  children: React.ReactNode
  stores?: StoresType
}
//
const storeContext = createContext<EmpStoreType>({} as EmpStoreType)
// StoreProvider
export const StoreProvider = ({children, stores}: TstoreProviderProps) => {
  const Stores: any = {}
  for (const k in configStores) {
    Stores[k] = useLocalStore(configStores[k])
  }
  // remote store
  for (const k in stores) {
    Stores[k] = useLocalStore(stores[k])
  }
  return <storeContext.Provider value={Stores}>{children}</storeContext.Provider>
}
// Store hook
export const useStores: () => any = () => {
  const stores = useContext(storeContext)
  if (!stores) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return stores
}
