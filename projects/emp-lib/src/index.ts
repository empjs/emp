import logger from './logger'
import mod from './mod'
const App = () => {
  mod('this is mod')
  const worker = new Worker(new URL('src/worker.ts', import.meta.url))
  worker.postMessage({
    question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  })
  worker.onmessage = ({data: {answer}}) => {
    logger.info('[main thead]', answer)
  }
}
export default App
