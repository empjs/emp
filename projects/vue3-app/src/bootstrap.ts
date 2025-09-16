import {createPinia} from 'pinia'
import App from 'src/components/App.vue'
import {createApp} from 'vue'

const pinia = createPinia()
const app = createApp(App)
//
app.use(pinia)
app.mount('#emp-root')
