
import Theme from 'vitepress/theme'
import { h } from 'vue'
import Team from './components/Team.vue'
import './styles/vars.css'
export default {
	...Theme,
	Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(Team),
    })
  },
}
