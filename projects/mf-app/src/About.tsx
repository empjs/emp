import {Link} from 'react-router-dom'
import {useStore, StoreProvider} from '@mfHost/store'
import {observer} from 'mobx-react'

const About = observer(() => {
  const {incStore} = useStore()
  return (
    <>
      <p>
        Host incStore num <b style={{fontSize: '60px'}}>{incStore.num}</b>
      </p>
    </>
  )
})
// const ProviderAbout = () => <About />
export default About
