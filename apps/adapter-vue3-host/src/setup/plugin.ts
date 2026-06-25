import {createPinia} from 'pinia'
import type {App} from 'vue'

export default function (app: App<Element>) {
  const pinia = createPinia()
  app.use(pinia)
}
