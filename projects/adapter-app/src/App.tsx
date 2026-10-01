import React, {useCallback, useState} from 'react'
import DemoCard from './lab/DemoCard'
import {frameworks} from './lab/registry'
import type {CheckResult, DemoEvent, FrameworkId} from './lab/types'
import {verifyPair} from './lab/verify'
import './lab/style.css'

const statusLabels = {pending: '待验证', running: '验证中', passed: '通过', failed: '失败'}
const pairKey = (host: FrameworkId, remote: FrameworkId) => `${host}/${remote}`

export default function App() {
  const [host, setHost] = useState<FrameworkId>('react17')
  const [family, setFamily] = useState('all')
  const [scenario, setScenario] = useState('basic')
  const [name, setName] = useState('Hello, Bridge')
  const [step, setStep] = useState(1)
  const [note, setNote] = useState(true)
  const [events, setEvents] = useState<(DemoEvent & {time: string})[]>([])
  const [results, setResults] = useState<Record<string, CheckResult>>({})
  const [checking, setChecking] = useState(false)
  const onEvent = useCallback(
    (event: DemoEvent) =>
      setEvents(previous =>
        [{...event, time: new Date().toLocaleTimeString('zh-CN', {hour12: false})}, ...previous].slice(0, 80),
      ),
    [],
  )
  const verifyAll = async () => {
    if (checking) return
    setChecking(true)
    setResults({})
    try {
      for (const hostItem of frameworks) {
        for (const component of frameworks) {
          const key = pairKey(hostItem.id, component.id)
          setResults(previous => ({...previous, [key]: {status: 'running', detail: '执行真实组件交互'}}))
          const result = await verifyPair(hostItem.id, component.id)
          setResults(previous => ({...previous, [key]: result}))
        }
      }
    } finally {
      setChecking(false)
    }
  }
  const passed = Object.values(results).filter(result => result.status === 'passed').length
  const failed = Object.values(results).filter(result => result.status === 'failed').length
  const cards: FrameworkId[][] =
    scenario === 'nested'
      ? [
          ['vue3', 'react19'],
          ['react18', 'vue2'],
        ]
      : frameworks.filter(item => family === 'all' || item.family === family).map(item => [item.id])
  return (
    <main>
      <header className="hero">
        <div className="brand">
          EMP <span>/ BRIDGE</span>
        </div>
        <div className="hero-row">
          <div>
            <p className="eyebrow">一个页面，看清每一层框架</p>
            <h1>让组件跨越框架。</h1>
            <p className="hero-description">
              选择宿主，操作组件，观察 Props、事件与生命周期。每个版本都来自实际运行时。
            </p>
          </div>
          <div className="coverage">
            <strong>
              6<span>种运行时</span>
            </strong>
            <strong>
              36<span>种组合</span>
            </strong>
            <strong>
              3<span>类场景</span>
            </strong>
          </div>
        </div>
      </header>
      <section className="control-panel" aria-label="演示设置">
        <div className="control-row">
          <label>
            宿主框架
            <select
              value={host}
              onInput={event => setHost(event.currentTarget.value as FrameworkId)}
              onChange={event => setHost(event.target.value as FrameworkId)}
              data-host-select
            >
              {frameworks.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            组件框架
            <select
              value={family}
              onInput={event => setFamily(event.currentTarget.value)}
              onChange={event => setFamily(event.target.value)}
            >
              <option value="all">全部框架</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
            </select>
          </label>
          <fieldset className="scenario-tabs" aria-label="演示场景">
            {[
              ['basic', '基础通信'],
              ['multi', '多实例'],
              ['nested', '混合嵌套'],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={scenario === id}
                className={scenario === id ? 'active' : 'quiet'}
                onClick={() => setScenario(id)}
              >
                {label}
              </button>
            ))}
          </fieldset>
        </div>
        <div className="control-row secondary">
          <label>
            组件名称
            <input value={name} onChange={event => setName(event.target.value)} data-name-input />
          </label>
          <label>
            计数步长
            <select
              value={step}
              onInput={event => setStep(Number(event.currentTarget.value))}
              onChange={event => setStep(Number(event.target.value))}
              data-step-select
            >
              {[1, 3, 5].map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={note} onChange={event => setNote(event.target.checked)} data-note-toggle />
            传入可选 Props
          </label>
          <p>修改后即时更新，组件计数保持。</p>
        </div>
      </section>
      <section className="demo-grid" aria-label="框架组件演示">
        {cards.map(chain => (
          <DemoCard
            key={`${host}-${scenario}-${chain.join('-')}`}
            host={host}
            chain={chain}
            name={name}
            step={step}
            note={note}
            copies={scenario === 'multi' ? 2 : 1}
            onEvent={onEvent}
          />
        ))}
      </section>
      <section className="matrix-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">兼容性可验证</p>
            <h2>宿主 × 组件</h2>
            <p>运行当前页面中的真实组件交互，检查版本、Props、回调、多实例和生命周期。</p>
          </div>
          <button onClick={verifyAll} disabled={checking} data-verify-all>
            {checking ? '正在验证…' : '验证全部 36 种组合'}
          </button>
        </div>
        <div className="matrix-scroll">
          <table>
            <caption className="sr-only">六种宿主与六种组件的验证结果</caption>
            <thead>
              <tr>
                <th scope="col">宿主 ↓ / 组件 →</th>
                {frameworks.map(item => (
                  <th scope="col" key={item.id}>
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {frameworks.map(hostItem => (
                <tr key={hostItem.id}>
                  <th scope="row">{hostItem.label}</th>
                  {frameworks.map(component => {
                    const key = pairKey(hostItem.id, component.id)
                    const result = results[key] || {status: 'pending', detail: '尚未在本次页面中执行验证'}
                    return (
                      <td key={key} data-pair={key} data-result={result.status}>
                        <span className={`matrix-status ${result.status}`} title={result.detail}>
                          {statusLabels[result.status]}
                        </span>
                        {result.status === 'failed' && <small>{result.detail}</small>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="matrix-summary" data-matrix-summary>
          本次验证：{passed} / 36 通过{failed ? `，${failed} 项失败` : ''}。刷新页面后重新验证。
        </p>
      </section>
      <section className="events-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">通信与生命周期</p>
            <h2>
              事件记录 <span className="event-count">{events.length}</span>
            </h2>
          </div>
          <button className="quiet" onClick={() => setEvents([])}>
            清空记录
          </button>
        </div>
        <div className="event-list">
          {events.length ? (
            events.map((event, index) => (
              <div className="event-row" key={index}>
                <time>{event.time}</time>
                <code>{event.runtime}</code>
                <span>{event.instanceId}</span>
                <strong>
                  {event.type}
                  {event.value !== undefined ? ` → ${event.value}` : ''}
                </strong>
              </div>
            ))
          ) : (
            <p>操作组件后，事件会显示在这里。</p>
          )}
        </div>
      </section>
      <footer className="page-footer">
        <span>运行时按需加载 · 独立渲染容器 · 版本来自组件自身</span>
        <a href="https://github.com/empjs/emp/tree/v3/projects/adapter-app" target="_blank" rel="noreferrer">
          查看示例源码 ↗
        </a>
        <span>原有远端示例：pnpm --filter adapter-app dev:legacy</span>
      </footer>
    </main>
  )
}
