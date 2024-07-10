import App from './App.vue'
import {createApp} from 'vue'
import Antd from '@v3/Antd'
console.log('Antd', Antd)
const app = createApp(App)
app.use(Antd)
app.mount('#emp-root')
