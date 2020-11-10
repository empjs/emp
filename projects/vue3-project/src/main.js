import {createApp, defineAsyncComponent} from 'vue'
import App from './App.vue'

const app = createApp(App)
app.component(
  'v3b-content',
  defineAsyncComponent(() => import('@v3b/Content')),
)
app.component(
  'v3b-button',
  defineAsyncComponent(() => import('@v3b/Button')),
)
app.mount('#emp-root')
