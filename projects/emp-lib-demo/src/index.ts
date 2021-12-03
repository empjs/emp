// import emp from 'emp-lib'
// emp()

// import wp from 'webpack-lib'
// wp()
import('emp-lib').then(fn => fn())

import('webpack-lib').then(fn => fn.default())
