/// <reference types="node" />

// files
declare module '*.svga' {
  const src: string
  export default src
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

/// <reference types="node" />
//
declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {title?: string}>

  const src: string
  export default src
}
// styles

declare module '*.module.css' {
  const classes: {[key: string]: string}
  export default classes
}

declare module '*.module.scss' {
  const classes: {[key: string]: string}
  export default classes
}

declare module '*.module.sass' {
  const classes: {[key: string]: string}
  export default classes
}

declare module '*.module.less' {
  const classes: {[key: string]: string}
  export default classes
}

declare module '*.module.styl' {
  const classes: {[key: string]: string}
  export default classes
}

// web worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

// import.meta

interface ImportMetaEnv {
  [key: string]: string | boolean | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
