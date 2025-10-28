import style from 'src/components/info.module.css'
import {ip, port} from 'src/config'

const Info = () => (
  <div className={'info box ' + style.info}>
    <h1>Info Components from App</h1>
    <p>{`from app_host_${port} ${ip}:${port}`}</p>
  </div>
)
export default Info
