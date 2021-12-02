/// <reference types="react" />
declare const App: () => JSX.Element
export default App
/// <reference types="react" />
declare const StoreComp: () => JSX.Element
export default StoreComp
export {}
declare class IncStore {
  num: number
  code: any
  constructor()
  inc(): void
  loadData(): Promise<void>
}
declare const _default: IncStore
export default _default
import * as React from 'react'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  customLabel: string
}
export declare const Button: ({customLabel, ...rest}: ButtonProps) => JSX.Element
export {}
