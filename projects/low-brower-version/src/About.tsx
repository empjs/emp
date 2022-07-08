import {observer} from 'mobx-react'
import store from 'src/store'
const About = observer(() => (
  <>
    About
    <p>{store.s}</p>
    <p>{JSON.stringify(store.data)}</p>
  </>
))
export default About
