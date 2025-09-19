import {createPinia} from 'pinia'
import App from 'src/components/App.vue'
import {createApp} from 'vue'
import {router} from './router'

export const app = createApp(App).use(createPinia()).use(router).mount('#emp-root')
