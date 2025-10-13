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
    </div>
  )
}
