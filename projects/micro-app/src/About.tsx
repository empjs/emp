import {Link} from 'react-router-dom'
import useIncStore, {useBearStore} from '@microHost/incStore'

const About = () => {
  const incStore = useIncStore(state => state)
  const bearStore = useBearStore(state => state)
  return (
    <>
      about <Link to="/">Home</Link>
      <p>incStore num {incStore.num}</p>
      <h2>bear Store</h2>
      <p>{bearStore.bears}</p>
      <button onClick={() => bearStore.increase(Math.round(Math.random() * 100))}>add bear</button>
    </>
  )
}
export default About
