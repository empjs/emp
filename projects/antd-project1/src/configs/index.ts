// const env = process ? process.env.REACT_APP_ENV : 'dev'
const env = process.env.EMP_ENV || 'dev'
console.log('env project antd ===>', env)
const config = require(`./${env}`)
config.env = env
export {env}
export default config
