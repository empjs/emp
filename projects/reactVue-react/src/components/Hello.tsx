import React, {ReactElement} from 'react'
import './common.scss'
import './common.less'
import './common.css'
const Hello = ({title}: {title: string}): ReactElement => (
  <>
    <h1>{title}</h1>
  </>
)

export default Hello
