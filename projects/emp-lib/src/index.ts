import logger from './logger'
import mod from './mod'
console.log('import.meta.url', import.meta.url, new URL('src/worker.ts', import.meta.url))
const worker = new Worker(new URL('src/worker.ts', import.meta.url))
// const worker = new Worker(new URL('src/worker.ts', import.meta.url), {
//   type: 'module',
// })

const App = () => {
  mod('this is mod')
  worker.postMessage({
    question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  })
  worker.onmessage = ({data: {answer}}) => {
    logger.info('[main thead]', answer)
  }
}
export default App
