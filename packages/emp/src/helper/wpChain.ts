import WPChain from 'webpack-chain'
const wpChain = new WPChain()
export const getConfig = () => {
  const conf = wpChain.toConfig()
  // console.log(conf)
  return conf
}
export default wpChain
