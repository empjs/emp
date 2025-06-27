import MainLayout from './Layout'

const App = () => (
  <>
    <h1>Proxy demo</h1>
    <div>app demo !!</div>
    <div>{window.navigator.userAgent}</div>
  </>
)
const Main = () => (
  <MainLayout>
    <App />
  </MainLayout>
)
export default Main
