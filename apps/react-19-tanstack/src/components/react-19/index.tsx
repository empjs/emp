import React, {lazy} from 'react'
import {ActionStateDemo} from './ActionStateDemo'
import {DeferredInput} from './DeferredInput'
import {FormStatusDemo} from './FormStatusDemo'
import {OptimisticListDemo} from './OptimisticListDemo'
import {SuspenseCard} from './SuspenseCard'
import {TransitionSearch} from './TransitionSearch'
import {ThemeContext, UseContextDemo} from './UseContextDemo'
import {UsePromiseDemo} from './UsePromiseDemo'

const LazyInner = lazy(() => import('./LazyInner'))

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
