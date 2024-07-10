declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '*.svg' {
  import Vue, {VueConstructor} from 'vue'
  const content: VueConstructor<Vue>
  export default content
}

declare module '*.less' {
  const classes: {readonly [key: string]: string}
  export default classes
}

declare module 'ATable'
