import App from 'src/components/App.vue'
import plugin from 'src/setup/plugin'
import {router} from 'src/setup/router'
import {createApp} from 'vue'

const app = createApp(App)
//
plugin(app)
app.use(router)
app.mount('#emp-root')
