import style from 'src/components/about.module.css'

const About = ({desc}: any) => (
  <div className={'about box ' + style.about}>
    <h1>About Components!!!</h1>
    <p>{desc}</p>
  </div>
)
export default About
