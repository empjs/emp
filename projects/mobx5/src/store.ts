import {createContext, useContext} from 'react'
import {configure} from 'mobx'
configure({isolateGlobalState: true})
export const StoreContext = createContext<any>(null)
export const useStores = () => {
  const stores = useContext(StoreContext)
  if (!stores) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return stores
}
