import ElementPlus from 'element-plus/lib/index.esm'
import 'element-plus/lib/theme-chalk/index.css'
import {createApp} from 'vue'
import App from './App.vue'

createApp(App).use(ElementPlus).mount('#emp-root')
