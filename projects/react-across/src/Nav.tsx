import {useState} from 'react'
import {ip, port} from './share'

export const Nav = () => {
  return (
    <div className="nav">
      <a className={`${port == '1700' && 'act'}`} href={`http://${ip}:1700`}>
        React 17
      </a>
      <a className={`${port == '1800' && 'act'}`} href={`http://${ip}:1800`}>
        React 18
      </a>
      <a className={`${port == '1900' && 'act'}`} href={`http://${ip}:1900`}>
        React 19
      </a>
    </div>
  )
}
