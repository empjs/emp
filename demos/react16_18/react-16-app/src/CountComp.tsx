import {observer} from 'mobx-react'
import React, {version} from 'react'
import {countStore} from './store'

export const CountComp = observer(() => {
  const {count} = countStore
  return (
    <h3 className="tipsbox">
      <span>React {version}</span>
      Mobx setCount
      <button className="button-10" onClick={() => countStore.setCount(count + 1)}>
        count is {count}
      </button>
    </h3>
  )
})
export const ShowCountComp = observer(() => {
  return (
    <div>
      <h1 className="tipsbox">
        <span>React {version}</span> Mobx Count <b className="cblue">{countStore.count}</b>
      </h1>
    </div>
  )
})

export const Card = (props: any) => (
  <div className="card">
    <span className="title">{typeof props.title === 'string' ? props.title : props.title()}</span>
    {props.children}
  </div>
)
