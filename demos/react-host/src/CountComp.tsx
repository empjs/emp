import {observer} from 'mobx-react'
import {version} from 'react'
import css from './count.module.scss'
import {countStore} from './store'
export const CountComp = observer(() => {
  const {count} = countStore
  return (
    <div>
      <h3>
        Mobx setCount React {version}{' '}
        <button className={css['button-1']} onClick={() => countStore.setCount(count + 1)}>
          count is {count}
        </button>
      </h3>
    </div>
  )
})
export const ShowCountComp = observer(() => {
  return (
    <h1>
      Mobx Count <b className={css.cpink}>{countStore.count}</b>
    </h1>
  )
})
