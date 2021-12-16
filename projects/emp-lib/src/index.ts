import logger from './helper/logger'
import mod from '@src/mod'
import {b, logger as modLogger} from 'src/mod'
console.log('import.meta.url', import.meta.url, new URL('src/worker/index.ts', import.meta.url))
const worker = new Worker(new URL('src/worker/index.ts', import.meta.url))
// const worker = new Worker(new URL('src/worker.ts', import.meta.url), {
//   type: 'module',
// })

const App = () => {
  mod('this is mod')
  modLogger.info('mode logger')
  worker.postMessage({
    question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  })
  worker.onmessage = ({data: {answer}}) => {
    logger.info('[main thead]', answer)
  }
}
export {mod, logger, b}
export default App
