import B1 from 'src/components/B1'
import B2 from 'src/components/B2'
import B3 from 'src/components/B3'
import B4 from 'src/components/B4'
import TWPlayer from 'src/components/TWPlayer'
import Layout from './components/Layout'
import {Shop} from './components/shop'

function App() {
  return (
    <Layout>
      {/* 
      <B2 />
      <B3 />
      <B4 /> */}
      <B1 />
      <Shop />
    </Layout>
  )
}

export default App
