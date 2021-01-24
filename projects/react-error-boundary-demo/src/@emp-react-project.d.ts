declare module '@emp/react-project/App' {
  /// <reference types="react" />
  const App: () => JSX.Element
  export default App
}
declare module '@emp/react-project/bootstrap' {
  export {}
}
declare module '@emp/react-project/components/Hello' {
  /// <reference types="react" />
  export interface HelloProps {
    compiler: string
    framework: string
  }
  const Hello: (props: HelloProps) => JSX.Element
  export default Hello
}
declare module '@emp/react-project/helper' {
  export const log: (d: any) => void
}
declare module '@emp/react-project' {}
declare module '@emp/react-project' {
  import main = require('@emp/react-project')
  export = main
}
