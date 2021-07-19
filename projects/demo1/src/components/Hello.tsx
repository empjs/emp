import React from 'react'
import './common.scss'
import './common.less'
import './common.css'
import scss from './hello.module.scss'
import less from './hello.module.less'
import css from './hello.module.css'
console.log(css, less, scss)
const config = await import('src/configs/index')
const Hello = () => (
  <>
    <div className={scss.logo}></div>
    <h1>Hello from Typescript and Demo!!!</h1>
    <p>config:{JSON.stringify(config.default)}</p>
    <p className={scss.helloStyle}>sass module style</p>
    <p className={less.helloStyle}>less module style</p>
    <p className={css.helloStyle}>css module style</p>
  </>
)

export default Hello
