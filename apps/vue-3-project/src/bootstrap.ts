import Antd from '@v3/Antd'
import {createPinia} from 'pinia'
import {createApp} from 'vue'
import App from './App.vue'
import {router} from './router'

console.log('Antd', Antd)
const app = createApp(App)
app.use(Antd)
app.use(createPinia())
app.use(router)
app.mount('#emp-root')
