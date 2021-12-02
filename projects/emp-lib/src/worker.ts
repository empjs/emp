import logger from 'src/logger'
self.onmessage = async ({data: {question}}) => {
  logger.info('[worker]', question)
  const mod = await import('./mod')
  mod.default('abc')
  self.postMessage({
    answer: 42,
  })
}
