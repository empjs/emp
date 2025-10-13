import React, {lazy, use, useActionState, useOptimistic, useState} from 'react'
import {useFormStatus} from 'react-dom'
import {DeferredInput} from './DeferredInput'
import {SuspenseCard} from './SuspenseCard'
import {TransitionSearch} from './TransitionSearch'

const LazyInner = lazy(() => import('./LazyInner'))

// Demo resources for `use()`
const greetingPromise = new Promise<string>(resolve => {
  setTimeout(() => resolve('Hello from use() after a short delay!'), 800)
})

// Context demo for `use(Context)`
const ThemeContext = React.createContext<'light' | 'dark'>('light')

function UsePromiseDemo() {
  const message = use(greetingPromise)
  return (
    <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
      <h3 className="text-lg font-semibold mb-2">use(Promise)</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )
}

function UseContextDemo() {
  const theme = use(ThemeContext)
  return (
    <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
      <h3 className="text-lg font-semibold mb-2">use(Context)</h3>
      <p className="text-sm">
        Current theme from Context: <span className="font-mono">{theme}</span>
      </p>
    </div>
  )
}

function FormStatusDemo() {
  async function submit(formData: FormData) {
    // Simulate async submit
    await new Promise(r => setTimeout(r, 1000))
  }
  function SubmitButton() {
    const {pending} = useFormStatus()
    return (
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Submitting…' : 'Submit'}
      </button>
    )
  }
  return (
    <form action={submit} className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-semibold">useFormStatus()</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Tracks form pending state without extra local state.</p>
      <div className="flex gap-2">
        <input
          name="demo"
          placeholder="Type something…"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        />
        <SubmitButton />
      </div>
    </form>
  )
}

function ActionStateDemo() {
  const [message, formAction, isPending] = useActionState(async (prevMessage: string, formData: FormData) => {
    const name = String(formData.get('name') || '').trim()
    await new Promise(r => setTimeout(r, 1000))
    if (!name) return 'Please enter a name.'
    return `Saved: ${name}`
  }, '')

  return (
    <form
      action={formAction}
      className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4 space-y-3"
    >
      <h3 className="text-lg font-semibold">useActionState()</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Updates local state from the last form action result, with pending.
      </p>
      <div className="flex gap-2">
        <input
          name="name"
          placeholder="Your name"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
      {message ? <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p> : null}
    </form>
  )
}

function OptimisticListDemo() {
  const [items, setItems] = useState<string[]>(['Alpha', 'Beta'])
  const [optimisticItems, addOptimistic] = useOptimistic(items, (current: string[], newItem: string) => {
    return [...current, newItem]
  })

  async function handleAdd(formData: FormData) {
    const value = String(formData.get('item') || '').trim()
    if (!value) return
    // Show instantly
    addOptimistic(value)
    // Simulate server request
    await new Promise(r => setTimeout(r, 900))
    // Commit
    setItems(prev => [...prev, value])
  }

  return (
    <form
      action={handleAdd}
      className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4 space-y-3"
    >
      <h3 className="text-lg font-semibold">useOptimistic()</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Instantly reflect changes while async work completes.</p>
      <div className="flex gap-2">
        <input
          name="item"
          placeholder="Add item"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {optimisticItems.map((it, idx) => (
          <li key={`${it}-${idx}`} className="rounded-md border px-3 py-2 text-sm bg-white/60 dark:bg-neutral-800/60">
            {it}
          </li>
        ))}
      </ul>
    </form>
  )
}

export default function React19FeatureSuite() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/60 dark:bg-neutral-950/60 border-b mb-10 md:mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">React 19 Feature Suite</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Demonstrations of modern APIs: use(), useActionState, useOptimistic, and useFormStatus.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        <section className="grid md:grid-cols-2 gap-8">
          <React.Suspense
            fallback={<div className="rounded-lg border p-4 text-sm text-gray-500">Loading use(Promise)…</div>}
          >
            <UsePromiseDemo />
          </React.Suspense>
          <ThemeContext.Provider value="dark">
            <UseContextDemo />
          </ThemeContext.Provider>
        </section>

        <section className="grid md:grid-cols-2 gap-8 my-10 md:my-12">
          <FormStatusDemo />
          <ActionStateDemo />
        </section>

        <section className="my-10 md:my-12">
          <OptimisticListDemo />
        </section>

        <section className="grid md:grid-cols-2 gap-8 my-10 md:my-12">
          <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
            <h3 className="text-lg font-semibold mb-2">TransitionSearch</h3>
            <TransitionSearch />
          </div>
          <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
            <h3 className="text-lg font-semibold mb-2">DeferredInput</h3>
            <DeferredInput />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
            <h3 className="text-lg font-semibold mb-2">SuspenseCard</h3>
            <SuspenseCard />
          </div>
          <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
            <h3 className="text-lg font-semibold mb-2">LazyInner (lazy)</h3>
            <React.Suspense fallback={<div className="text-sm text-gray-500">Loading lazy component…</div>}>
              <LazyInner />
            </React.Suspense>
          </div>
        </section>
      </main>
    </div>
  )
}
