import Antd from 'ant-design-vue'
import {createApp} from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(Antd)
app.mount('#emp-root')
