import React from 'react'
import css from './svg.module.scss'
import url, {ReactComponent as Logo} from 'src/assets/logo.svg'
// console.log('Logo', Logo, url)
export default function SVG() {
  return (
    <>
      <h3>.Svg</h3>
      <Logo width="300" className={css['App-logo']} />
      <h3>.IMG Src</h3>
      <img width="300" src={url} alt="logo" />
    </>
  )
}
