/// <reference types="@efox/emp-tsconfig" />

declare module '*.svga' {
  export default any
}

interface ImportMetaEnv {
  [key: string]: string | boolean | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
