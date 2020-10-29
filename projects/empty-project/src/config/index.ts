const env = process.env.EMP_ENV || 'dev'
console.log('env project antd ===>', env, 'process.env.EMP_ENV', process.env.EMP_ENV)
const config = require(`src/config/${process.env.EMP_ENV}`)
config.env = env
export {env}
export default config
