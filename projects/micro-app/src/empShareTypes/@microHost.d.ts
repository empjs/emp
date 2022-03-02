declare module '@microHost/App' {
  import {Button} from '@microHost/.D:/emp/projects/micro-host/microHost/Button'
  import StoreComp from '@microHost/StoreComp'
  import incStore from '@microHost/importExport/incStore'
  export {Button, StoreComp, incStore}
  const App: () => JSX.Element
  export default App
}
declare module '@microHost/bootstrap' {
  export {}
}
declare module '@microHost' {}
declare module '@microHost/StoreComp' {
  const StoreComp: () => JSX.Element
  export default StoreComp
}
declare module '@microHost/Button' {
  import * as React from 'react'
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string
  }
  export const Button: ({customLabel, ...rest}: ButtonProps) => JSX.Element
  export {}
}
declare module '@microHost/importExport/incStore' {
  class IncStore {
    num: number
    code: any
    constructor()
    inc(): void
    loadData(): Promise<void>
  }
  const _default: IncStore
  export default _default
}

declare module '@microHost/incStore' {
  class IncStore {
    num: number
    code: any
    constructor()
    inc(): void
    loadData(): Promise<void>
  }
  const _default: IncStore
  export default _default
}
