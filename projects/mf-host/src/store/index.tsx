import {createContext, useContext} from 'react'
import incStore, {IncStore} from './incStore'

export interface IStore {
  incStore: IncStore
}
export const store: IStore = {
  incStore: new IncStore(),
}
export const StoreContext = createContext(store)
export const useStore = () => {
  return useContext(StoreContext)
}

export const StoreProvider = (props: any) => (
  <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
)
