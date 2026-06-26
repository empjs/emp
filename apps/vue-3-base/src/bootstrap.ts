import Antd from 'ant-design-vue'
import {createPinia} from 'pinia'
import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(Antd)
app.use(createPinia())
app.mount('#emp-root')
