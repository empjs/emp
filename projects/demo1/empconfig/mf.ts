import dev from './mf-development'
import prod from './mf-production'

export default env => (env === 'production' ? prod : dev)
