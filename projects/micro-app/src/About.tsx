import {Link} from 'react-router-dom'
import incStore from './store/incStore'
import {observer} from 'mobx-react'

const About = observer(() => (
  <>
    about <Link to="/">Home</Link>
    <p>incStore num {incStore.num}</p>
  </>
))
export default About
