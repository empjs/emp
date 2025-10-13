import {Accordion} from './Accordion'
import {CardGrid} from './CardGrid'
import {FeatureList} from './FeatureList'
import {Form} from './Form'
import {Hero} from './Hero'
import {StatsBar} from './StatsBar'
import {Table} from './Table'

export default function Showcase() {
  return (
    <div className="space-y-8">
      <Hero />

      <section id="components" className="space-y-6">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Components</h2>
        <CardGrid />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Feature List</h2>
        <FeatureList />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Stats</h2>
        <StatsBar />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Table</h2>
        <Table />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Form</h2>
        <Form />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Accordion</h2>
        <Accordion />
      </section>

      {/* Dark Mode showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Dark Mode</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-white/70 p-4 dark:bg-neutral-900/60 dark:text-gray-200">
            <p className="text-sm">This block uses <span className="font-mono">dark:</span> variants. Switch your system theme to see changes.</p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-gray-800 dark:bg-neutral-950 dark:text-gray-200">
            <p className="text-sm">Light / Dark contrast demo with background and text colors.</p>
          </div>
        </div>
      </section>

      {/* Shadows & Rings with color */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Shadows & Rings</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <button className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow-lg shadow-indigo-500/50">Indigo Shadow</button>
          <button className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow-lg shadow-cyan-500/50">Cyan Shadow</button>
          <button className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow-xl shadow-blue-500/50">Blue Shadow</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 inset-shadow-sm inset-shadow-indigo-500/50">Inset Indigo</div>
          <div className="rounded-lg bg-white p-4 inset-shadow-xs">Inset Shadow XS</div>
          <div className="rounded-lg bg-white p-4 ring-4 ring-blue-500/50">Ring Demo</div>
        </div>
      </section>

      {/* Backface Visibility / 3D flip card */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold mt-2 md:mt-4 mb-2 md:mb-3">Backface Visibility</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="group [perspective:1000px]">
            <div className="relative h-40 w-full rounded-xl border bg-white [transform-style:preserve-3d] transition-transform duration-500 group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 [backface-visibility:hidden]">Front</div>
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-pink-50 text-pink-700 [transform:rotateY(180deg)] [backface-visibility:hidden]">Back</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Hover to flip; backface is hidden.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
