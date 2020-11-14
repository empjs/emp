import {EMPData} from './src'

declare global {
  namespace cc {
    export let EMP: EMPData
  }
  interface Window {
    boot: () => void
  }
}
