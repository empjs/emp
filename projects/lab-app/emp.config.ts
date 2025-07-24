import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.6.0-beta.1/output/sdk.js`,
          },
        },
      }),
    ],
    build: {
      sourcemap: true,
    },
  }
})
