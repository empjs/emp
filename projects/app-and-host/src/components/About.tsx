import style from 'src/components/about.module.css'
import {ip, port} from 'src/config'

const About = () => (
  <div className={'about box ' + style.about}>
    <h1>About Components</h1>
    <p>{`from About ${ip}:${port}`}</p>
  </div>
)
export default About
