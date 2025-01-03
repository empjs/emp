import {useCallback} from 'react'
import {ip, mode, port} from './config'
// console.log('mode', mode)
export const Nav = () => {
  const getUrl = useCallback((p: string) => {
    return mode === 'development' ? `http://${ip}:${p}` : `/c${p}/`
  }, [])
  const getAct = useCallback((p: string) => {
    return port == p ? 'act' : ''
  }, [])
  return (
    <div className="nav">
      <a className={getAct('1700')} href={getUrl('1700')}>
        React 17
      </a>
      <a className={getAct('1800')} href={getUrl('1800')}>
        React 18
      </a>
      <a className={getAct('1900')} href={getUrl('1900')}>
        React 19
      </a>
      <a href="https://github.com/empjs/emp/tree/v3/projects/react-across" target="_blank" rel="noreferrer">
        Github
      </a>
    </div>
  )
}
