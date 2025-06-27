import Antd from '@v3/Antd'
import {createApp} from 'vue'
import App from './App.vue'
import {router} from './router'

console.log('Antd', Antd)
const app = createApp(App)
app.use(Antd)
app.use(router)
app.mount('#emp-root')
