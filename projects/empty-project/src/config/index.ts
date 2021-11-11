const env = process.env.mode && process.env.mode === 'development' ? 'dev' : 'prod'
console.log('process.env.mode', process.env.mode, 'process.env.env', process.env.env)
// console.log('env project antd ===>', env, 'process.env.EMP_ENV', process.env.EMP_ENV)
const config = require(`src/config/${env}`)
config.env = env
export {env}
export default config
