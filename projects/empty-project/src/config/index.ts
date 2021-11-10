const env = process.env.mode && process.env.mode === 'development' ? 'dev' : 'prod'
console.log('process.env.mode', process.env.mode)
console.log('process.env.projectID', process.env.projectID)
// console.log('env project antd ===>', env, 'process.env.EMP_ENV', process.env.EMP_ENV)
const config = require(`src/config/${env}`)
config.env = env
export {env}
export default config
