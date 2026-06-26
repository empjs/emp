import {defineConfig} from '@rstest/core'

export default defineConfig({
  testEnvironment: 'node',
  include: ['scripts/**/*.test.ts'],
})
