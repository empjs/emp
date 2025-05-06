import path from 'node:path'

export const empRoot = path.resolve(__dirname, __filename).replace(`${path.sep}dist${path.sep}index.js`, '')
