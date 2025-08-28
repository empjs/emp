import style from 'src/components/info.module.css'

const Info = ({desc}: any) => (
  <div className={'info box ' + style.info}>
    <h1>Info Components!!!</h1>
    <p>{desc}</p>
  </div>
)
export default Info
