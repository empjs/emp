import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
