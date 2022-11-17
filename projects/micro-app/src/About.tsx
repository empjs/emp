import {Link} from 'react-router-dom'
import useIncStore from '@microHost/incStore'

const About = () => {
  const incStore = useIncStore(state => state)
  return (
    <>
      about <Link to="/">Home</Link>
      <p>incStore num {incStore.num}</p>
    </>
  )
}
export default About
