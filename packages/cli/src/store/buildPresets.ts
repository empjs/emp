import type {Output} from '@rspack/core'
import type {BuildPresetName, BuildType} from 'src/types/config'

type BuildPreset = {
  build: Partial<Omit<BuildType, 'preset'>>
  output?: Output
}

const buildPresets: Record<BuildPresetName, BuildPreset> = {
  chrome60: {
    build: {
      target: 'es2015',
      useESM: false,
      polyfill: {
        mode: 'entry',
        splitChunks: true,
        browserslist: ['Chrome >= 60'],
      },
    },
    output: {
      environment: {
        arrowFunction: true,
        asyncFunction: true,
        bigIntLiteral: false,
        const: true,
        computedProperty: true,
        destructuring: true,
        dynamicImport: false,
        dynamicImportInWorker: false,
        forOf: true,
        globalThis: false,
        logicalAssignment: false,
        methodShorthand: true,
        module: false,
        optionalChaining: false,
        templateLiteral: true,
      },
    },
  },
  modern: {
    build: {
      target: 'es2018',
      useESM: true,
    },
  },
}

export function getBuildPreset(name?: BuildPresetName) {
  return name ? buildPresets[name] : undefined
}
