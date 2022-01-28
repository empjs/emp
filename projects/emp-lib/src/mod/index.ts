import logger from '../helper/logger'

const mod = (d: string) => {
  logger.info('[[[[mod]]]]', d)
  return 'this is mod'
}
export default mod

export const b = () => console.log(b)
export {logger}
