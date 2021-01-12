declare module '@emp/demo1/bootstrap' {
  export {}
}
declare module '@emp/demo1/components/Demo' {
  /// <reference types="react" />
  const Demo: () => JSX.Element
  export default Demo
}
declare module '@emp/demo1/components/Hello' {
  /// <reference types="react" />
  const Hello: () => JSX.Element
  export default Hello
}
declare module '@emp/demo1/index' {}
declare module '@emp/demo1/configs/index' {}
declare module '@emp/demo1' {
  import main = require('@emp/demo1/index')
  export = main
}
