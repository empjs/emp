import * as chalkModule from 'chalk'
import type {ChalkInstance} from 'chalk'

type ChalkModule = typeof chalkModule & {
  default?: unknown
}

const isChalkInstance = (value: unknown): value is ChalkInstance =>
  typeof value === 'function' && typeof (value as Partial<ChalkInstance>).hex === 'function'

const normalizeChalk = (mod: ChalkModule): ChalkInstance => {
  const defaultExport = mod.default
  if (isChalkInstance(defaultExport)) {
    return defaultExport
  }
  if (defaultExport && typeof defaultExport === 'object') {
    const nestedDefault = (defaultExport as {default?: unknown}).default
    if (isChalkInstance(nestedDefault)) {
      return nestedDefault
    }
  }
  return mod as unknown as ChalkInstance
}

export default normalizeChalk(chalkModule as ChalkModule)
