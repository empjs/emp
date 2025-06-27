import {List} from 'src/components/List'
import {Stat} from 'src/components/Stat'
import {Accordion} from './components/Accordion'
import {Carousel} from './components/Carousel'
import {Diff} from './components/Diff'
import {Layout} from './components/Layout'
import {Table} from './components/Table'

function App() {
  return (
    <Layout>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black-800 p-4 md:p-10 text-center">
        EMPv3 TailwindCSS v4 Daisyui
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
        <div className="col-span-1 md:col-span-2 overflow-x-auto">
          <div className="w-full max-w-full">
            <Stat />
          </div>
        </div>
        <div className="col-span-1">
          <Carousel />
        </div>
        <div className="col-span-1">
          <List />
        </div>
        <div className="col-span-1">
          <Diff />
        </div>
        <div className="col-span-1">
          <Accordion />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3 overflow-x-auto">
          <div className="w-full max-w-full">
            <Table />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
