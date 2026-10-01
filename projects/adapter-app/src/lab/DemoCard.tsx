import React, {useEffect, useRef, useState} from 'react'
import {loadRuntime} from './registry'
import type {BridgeProviderReturn, DemoEvent, DemoProps, FrameworkId, FrameworkRuntime} from './types'

interface CardProps {
  host: FrameworkId
  chain: FrameworkId[]
  name: string
  step: number
  note: boolean
  copies: number
  onEvent: (event: DemoEvent) => void
}

export default function DemoCard({host, chain, name, step, note, copies, onEvent}: CardProps) {
  const alive = useRef(true)
  useEffect(
    () => () => {
      alive.current = false
    },
    [],
  )
  const containers = useRef<(HTMLDivElement | null)[]>([])
  const drivers = useRef<BridgeProviderReturn[]>([])
  const latest = useRef({name, step, note})
  latest.current = {name, step, note}
  const [info, setInfo] = useState<FrameworkRuntime[]>([])
  const [status, setStatus] = useState('加载中')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [fail, setFail] = useState(false)
  const [slow, setSlow] = useState(false)
  const [lifecycle, setLifecycle] = useState({mounts: 0, unmounts: 0})
  const key = `${host}-${chain.join('-')}`
  const propsFor = (index: number): DemoProps => ({
    name: latest.current.name,
    step: latest.current.step,
    ...(latest.current.note ? {note: '来自宿主的可选 Props'} : {}),
    instanceId: `${key}-${index}`,
    onChange: onEvent,
    onLifecycle(event) {
      onEvent(event)
      if (!alive.current) return
      if (event.type === 'mounted') setStatus('运行中')
      setLifecycle(current => ({
        mounts: current.mounts + (event.type === 'mounted' ? 1 : 0),
        unmounts: current.unmounts + (event.type === 'unmounted' ? 1 : 0),
      }))
    },
  })
  const chainKey = chain.join('-')
  useEffect(() => {
    if (!mounted) {
      setStatus('已卸载')
      return
    }
    let disposed = false
    const owned: {driver: BridgeProviderReturn; dom: HTMLDivElement}[] = []
    setError('')
    setInfo([])
    setStatus('加载中')
    const report = (err: Error) => {
      if (disposed) return
      setError(err.message)
      setStatus('失败')
    }
    Promise.all([host, ...chain].map(loadRuntime))
      .then(runtimes => {
        if (disposed) return
        setInfo(runtimes)
        let provider = runtimes[runtimes.length - 1].provider
        for (let i = runtimes.length - 2; i > 0; i--) provider = runtimes[i].host(provider, report)
        const inner = provider
        const consumer = runtimes[0].host(async () => {
          if (slow || fail) await new Promise(resolve => setTimeout(resolve, 700))
          if (fail) throw new Error('模拟组件加载失败，可点击重试恢复')
          return {default: inner}
        }, report)
        for (let i = 0; i < copies; i++) {
          const dom = containers.current[i]
          if (!dom) continue
          const driver = consumer()
          owned.push({driver, dom})
          driver.render(dom, {
            ...propsFor(i),
            onLifecycle(event: DemoEvent) {
              propsFor(i).onLifecycle?.(event)
              if (!disposed && event.type === 'mounted') setStatus('运行中')
            },
          })
        }
        drivers.current = owned.map(item => item.driver)
      })
      .catch(report)
    return () => {
      disposed = true
      drivers.current = []
      for (const {driver, dom} of owned) driver.destroy(dom)
    }
  }, [host, chainKey, copies, mounted, attempt, fail, slow])
  useEffect(() => {
    drivers.current.forEach((driver, index) => {
      const dom = containers.current[index]
      if (dom) driver.render(dom, propsFor(index))
    })
  }, [name, step, note])

  return (
    <article
      className={`demo-card ${chain[chain.length - 1].startsWith('vue') ? 'vue-card' : 'react-card'}`}
      data-card={key}
    >
      <header className="card-header">
        <div>
          <span className="eyebrow">{chain.length > 1 ? '混合嵌套' : '跨框架组件'}</span>
          <h2>
            {info.length
              ? info
                  .slice(1)
                  .map(item => item.label)
                  .join(' → ')
              : chain.join(' → ')}
          </h2>
        </div>
        <output className={`status ${status === '运行中' ? 'running' : status === '失败' ? 'failed' : ''}`}>
          {status}
        </output>
      </header>
      <p className="version-chain">
        {info.length
          ? info.map(item => `${item.label.split(' ')[0]} ${item.version}`).join(' → ')
          : '正在读取各组件运行时版本…'}
      </p>
      <div className="demo-body">
        {error && (
          <div className="error-panel" role="alert">
            {error}
            <button
              onClick={() => {
                setStatus('加载中')
                setFail(false)
                setAttempt(value => value + 1)
              }}
            >
              重试
            </button>
          </div>
        )}
        {Array.from({length: copies}, (_, index) => (
          <div
            key={index}
            className="instance"
            data-instance-slot={index}
            ref={(dom: HTMLDivElement | null) => {
              containers.current[index] = dom
            }}
          />
        ))}
      </div>
      <footer>
        <div className="card-actions">
          <button className="quiet" onClick={() => setMounted(value => !value)}>
            {mounted ? '卸载' : '重新挂载'}
          </button>
          <button
            className="quiet"
            onClick={() => {
              setStatus('加载中')
              setMounted(true)
              setFail(true)
              setAttempt(value => value + 1)
            }}
          >
            模拟失败
          </button>
          <button
            className="quiet"
            onClick={() => {
              setStatus('加载中')
              setMounted(true)
              setSlow(value => !value)
              setAttempt(value => value + 1)
            }}
          >
            {slow ? '关闭慢加载' : '慢加载'}
          </button>
        </div>
        <span className="lifecycle">
          挂载 {lifecycle.mounts} · 卸载 {lifecycle.unmounts}
        </span>
        <details>
          <summary>框架与 Bridge 版本</summary>
          {info.map((item, index) => (
            <p key={index}>
              {index === 0 ? '宿主' : '组件'}：{item.label.split(' ')[0]} {item.version}
              <br />
              {item.bridge} {item.bridgeVersion}
            </p>
          ))}
        </details>
      </footer>
    </article>
  )
}
