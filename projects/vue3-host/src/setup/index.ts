import App from 'src/components/App.vue'
import {router} from 'src/setup/router'
import {createApp} from 'vue'

// import { createPinia } from 'pinia'

// const pinia = createPinia()

const app = createApp(App)
// app.use(pinia)
app.use(router)
app.mount('#emp-root')
