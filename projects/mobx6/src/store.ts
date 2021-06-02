import React from 'react'
// import {configure} from 'mobx'
// configure({isolateGlobalState: false})
export const StoreContext = React.createContext<any>(null)
export const useStores = () => {
  const stores = React.useContext(StoreContext)
  if (!stores) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return stores
}
