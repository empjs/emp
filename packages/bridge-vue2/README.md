# @emp/bridge-vue2

Vue 2 bridge for EMP module federation, providing utilities to create and consume remote components.

## Installation

```bash
npm install @emp/bridge-vue2 vue@2
# or
yarn add @emp/bridge-vue2 vue@2
# or
pnpm add @emp/bridge-vue2 vue@2
```

## Usage

### As a Producer (exposing components)

```typescript
import { createBridgeComponent } from '@emp/bridge-vue2'
import MyComponent from './MyComponent.vue'

export default createBridgeComponent(MyComponent, {
  Vue: require('vue') // or import Vue from 'vue'
})
```

### As a Consumer (using remote components)

```typescript
import { createRemoteAppComponent } from '@emp/bridge-vue2'
import Vue from 'vue'

const RemoteComponent = createRemoteAppComponent(
  () => import('remote-module/component'),
  { Vue },
  {
    onError: (error) => console.error('Failed to load remote component', error)
  }
)

// Use in your Vue component
new Vue({
  components: { RemoteComponent },
  template: '<remote-component />'
}).$mount('#app')
```

## API

### `createBridgeComponent(component: any, options: Vue2Options)`

Creates a bridge provider for the given Vue 2 component.

### `createRemoteAppComponent(component: ComponentProvider, vueOptions: Vue2Options, options?: {onError?: (error: Error) => void})`

Creates a Vue 2 component that can load and render a remote component.

## Type Definitions

See [src/index.ts](./src/index.ts) for detailed type definitions.