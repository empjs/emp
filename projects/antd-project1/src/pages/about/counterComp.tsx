import {observer, useLocalStore, useObserver, Observer} from 'mobx-react-lite'
import React, {useEffect} from 'react'
// import {useStores} from 'src/stores'
import {useStores} from '@emp-antd/base/stores/index'
import {Radio} from 'antd'
const createStore = (count: number) => ({
  count,
  inc() {
    this.count += 1
  },
  dec() {
    this.count -= 1
  },
  async getAsync() {
    this.count = Math.random()
  },
})

export const AllObserverCounter = observer((props: {count?: number}) => {
  const store = useLocalStore(() => createStore(props.count || 0))
  return (
    <div>
      <h2>observer 实例</h2>
      <span>{store.count} count</span>
      <button onClick={store.inc}>Increment</button>
      <button onClick={store.dec}>Decrement</button>
    </div>
  )
})

export const AllObserverCounter2 = (props: any) => {
  const store = useLocalStore(() => createStore(props.count || 0))
  // console.log('AllObserverCounter render')
  return (
    <Observer>
      {() => (
        <div>
          <h2>Observer 组件 实例</h2>
          <span>{store.count} count</span>
          <button onClick={store.inc}>Increment</button>
          <button onClick={store.dec}>Decrement</button>
        </div>
      )}
    </Observer>
  )
}
export const AllObserverCounter3 = () => {
  const countStore = useLocalStore(() => createStore(100))
  return useObserver(() => {
    return (
      <div>
        <h2>useObserver 组件 实例</h2>
        <span>{countStore.count} count</span>
        <button onClick={countStore.inc}>Increment</button>
        <button onClick={countStore.dec}>Decrement</button>
        <button onClick={countStore.getAsync}>async</button>
      </div>
    )
  })
}

export const GlobalStoreComp = observer(() => {
  const {langStore} = useStores()
  const {$l} = langStore
  useEffect(() => {
    async function getLang() {
      if (langStore.country) await langStore.getLang({project: 'biugo_mobile', mod: 'person', lang: langStore.country})
    }
    getLang()
    console.log('useEffect')
  }, [langStore])
  console.log('observer', JSON.stringify($l))
  const handleLangChange = async (e: any) =>
    await langStore.getLang({project: 'biugo_mobile', mod: 'person', lang: e.target.value})
  return (
    <div>
      <Radio.Group value={langStore.country} onChange={handleLangChange}>
        <Radio.Button value="en">en</Radio.Button>
        <Radio.Button value="pt">pt</Radio.Button>
      </Radio.Group>
      <div>{JSON.stringify($l)}</div>
    </div>
  )
})
