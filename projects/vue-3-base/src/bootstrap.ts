import App from './App.vue'
import {createApp} from 'vue'
import Antd from 'ant-design-vue'
const app = createApp(App)
app.use(Antd)
app.mount('#emp-root')
