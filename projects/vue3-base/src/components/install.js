import Button from './Button'
import Content from './Content.vue'

export default {
  install(app) {
    console.log('install')
    try {
      app.component('emp-button', Button)
      app.component('v3b-content', Content)
      app.component('v3b-button', Button)
    } catch (err) {}
  },
}
