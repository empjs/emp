import {Link} from 'react-router-dom'
import incStore from '@mfHost/incStore'
import {observer} from 'mobx-react'

const About = observer(() => (
  <>
    <p>
      Host incStore num <b style={{fontSize: '60px'}}>{incStore.num}</b>
    </p>
  </>
))
export default About
