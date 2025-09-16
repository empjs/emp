// Vue Router type declarations
import 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $route: import('vue-router').RouteLocationNormalized
    $router: import('vue-router').Router
  }
}