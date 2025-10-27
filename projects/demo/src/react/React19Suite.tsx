import React, {use, useActionState, useDeferredValue, useMemo, useOptimistic, useState, useTransition} from 'react'
import {useFormStatus} from 'react-dom'

// 使用 use(Promise)
const greetingPromise = new Promise<string>(resolve => {
  setTimeout(() => resolve('use(Promise) 异步消息已就绪！'), 800)
})

function UsePromiseDemo() {
  const message = use(greetingPromise)
  return (
    <div style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{fontWeight: 600}}>use(Promise)</h3>
      <p style={{fontSize: 12, color: '#666'}}>{message}</p>
    </div>
  )
}

// 使用 use(Context)
const ThemeContext = React.createContext<'light' | 'dark'>('light')
function UseContextDemo() {
  const theme = use(ThemeContext)
  return (
    <div style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{fontWeight: 600}}>use(Context)</h3>
      <p style={{fontSize: 12}}>当前主题：{theme}</p>
    </div>
  )
}

// 使用 useFormStatus() 追踪表单提交状态
async function demoSubmit(formData: FormData) {
  // 模拟异步提交
  await new Promise(r => setTimeout(r, 1000))
}
function SubmitButton() {
  const {pending} = useFormStatus()
  return (
    <button type="submit" disabled={pending} style={{padding: '6px 12px'}}>
      {pending ? '提交中…' : '提交'}
    </button>
  )
}
function FormStatusDemo() {
  return (
    <form action={demoSubmit} style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{fontWeight: 600}}>useFormStatus()</h3>
      <p style={{fontSize: 12, color: '#666'}}>无需本地状态即可获取表单 pending 状态。</p>
      <div style={{display: 'flex', gap: 8}}>
        <input name="demo" placeholder="随便输入…" style={{flex: 1, padding: '6px 8px'}} />
        <SubmitButton />
      </div>
    </form>
  )
}

// 使用 useActionState() 同步最近一次表单 action 的结果
function ActionStateDemo() {
  const [message, formAction, isPending] = useActionState(async (prevMessage: string, formData: FormData) => {
    const name = String(formData.get('name') || '').trim()
    await new Promise(r => setTimeout(r, 1000))
    if (!name) return '请输入一个名称。'
    return `已保存：${name}`
  }, '')

  return (
    <form action={formAction} style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{fontWeight: 600}}>useActionState()</h3>
      <p style={{fontSize: 12, color: '#666'}}>根据上次表单 action 的返回更新本地状态，并提供 pending 状态。</p>
      <div style={{display: 'flex', gap: 8}}>
        <input name="name" placeholder="你的名字" style={{flex: 1, padding: '6px 8px'}} />
        <button type="submit" disabled={isPending} style={{padding: '6px 12px'}}>
          {isPending ? '保存中…' : '保存'}
        </button>
      </div>
      {message ? <p style={{fontSize: 12, marginTop: 8}}>{message}</p> : null}
    </form>
  )
}

// 使用 useOptimistic() 乐观更新列表
function OptimisticListDemo() {
  const [items, setItems] = useState<string[]>(['Alpha', 'Beta'])
  const [optimisticItems, addOptimistic] = useOptimistic(items, (current: string[], newItem: string) => {
    return [...current, newItem]
  })

  async function handleAdd(formData: FormData) {
    const value = String(formData.get('item') || '').trim()
    if (!value) return
    // 立即显示
    addOptimistic(value)
    // 模拟服务端请求
    await new Promise(r => setTimeout(r, 900))
    // 最终提交
    setItems(prev => [...prev, value])
  }

  return (
    <form action={handleAdd} style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{fontWeight: 600}}>useOptimistic()</h3>
      <p style={{fontSize: 12, color: '#666'}}>在异步完成前即时反映变更。</p>
      <div style={{display: 'flex', gap: 8}}>
        <input name="item" placeholder="添加条目" style={{flex: 1, padding: '6px 8px'}} />
        <button type="submit" style={{padding: '6px 12px'}}>
          添加
        </button>
      </div>
      <ul style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8}}>
        {optimisticItems.map((it, idx) => (
          <li
            key={`${it}-${idx}`}
            style={{border: '1px solid #ddd', borderRadius: 6, padding: '6px 8px', fontSize: 12}}
          >
            {it}
          </li>
        ))}
      </ul>
    </form>
  )
}

// 使用 useDeferredValue / useTransition 演示输入与列表更新（可选）
function DeferredInput() {
  const [text, setText] = useState('')
  const deferredText = useDeferredValue(text)
  const items = useMemo(() => Array.from({length: 1000}, (_, i) => `Row ${i}`), [])
  const filtered = useMemo(() => {
    const q = deferredText.toLowerCase()
    return items.filter(it => it.toLowerCase().includes(q))
  }, [items, deferredText])
  return (
    <div style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{fontWeight: 600}}>useDeferredValue</h3>
      <p style={{fontSize: 12, color: '#666'}}>使用延迟值保持输入流畅。</p>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="筛选行"
        style={{padding: '6px 8px', width: '100%'}}
      />
      <div style={{marginTop: 8, fontSize: 12}}>匹配：{filtered.length}</div>
      <ul style={{marginTop: 6, maxHeight: 180, overflow: 'auto'}}>
        {filtered.slice(0, 50).map(it => (
          <li key={it} style={{fontSize: 12}}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TransitionSearch() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const items = useMemo(() => Array.from({length: 1000}, (_, i) => `Item ${i}`), [])
  const [list, setList] = useState<string[]>(items)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    startTransition(() => {
      const v = value.toLowerCase()
      const next = items.filter(it => it.toLowerCase().includes(v))
      setList(next)
    })
  }
  return (
    <div style={{border: '1px solid #ddd', padding: 12, borderRadius: 8}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <h3 style={{fontWeight: 600}}>startTransition</h3>
        {isPending && <span style={{fontSize: 12, color: '#666'}}>列表更新中…</span>}
      </div>
      <p style={{fontSize: 12, color: '#666'}}>在不阻塞输入的情况下过滤大列表。</p>
      <input value={query} onChange={handleChange} placeholder="搜索条目" style={{padding: '6px 8px', width: '100%'}} />
      <div style={{marginTop: 8, fontSize: 12}}>匹配：{list.length}</div>
      <ul style={{marginTop: 6, maxHeight: 180, overflow: 'auto'}}>
        {list.slice(0, 50).map(it => (
          <li key={it} style={{fontSize: 12}}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function React19Suite() {
  return (
    <div>
      <h2 className="title">React 19 新特性</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12}}>
        <React.Suspense fallback={<div style={{fontSize: 12, color: '#666'}}>use(Promise) 加载中…</div>}>
          <UsePromiseDemo />
        </React.Suspense>
        <ThemeContext.Provider value="dark">
          <UseContextDemo />
        </ThemeContext.Provider>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 12}}>
        <FormStatusDemo />
        <ActionStateDemo />
      </div>

      <div style={{marginTop: 12}}>
        <OptimisticListDemo />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 12}}>
        <TransitionSearch />
        <DeferredInput />
      </div>
    </div>
  )
}
