declare module '@emp/demo2/bootstrap' {
  export {}
}
declare module '@emp/demo2/components/Hello' {
  /// <reference types="react" />
  export interface HelloProps {
    compiler: string
    framework: string
  }
  const Hello: (props: HelloProps) => JSX.Element
  export default Hello
}
declare module '@emp/demo2/helper' {
  export const log: (d: any) => void
}
declare module '@emp/demo2/index' {}
declare module '@emp/demo2' {
  import main = require('@emp/demo2/index')
  export = main
}

declare module '@emp/vueComponents/Content.vue'
declare module 'vuera'
