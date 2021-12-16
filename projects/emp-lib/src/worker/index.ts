import logger from 'src/helper/logger'
self.onmessage = async ({data: {question}}) => {
  logger.info('[worker]', question)
  const mod = await import('src/mod')
  mod.default('abc')
  self.postMessage({
    answer: 42,
  })
}
