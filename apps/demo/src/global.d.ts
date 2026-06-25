declare let module: any

declare module '*.txt?raw' {
  const src: string
  export default src
}
