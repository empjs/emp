import {defineConfig} from '@rstest/core'

export default defineConfig({
  testEnvironment: 'node',
  include: ['test/**/*.test.ts'],
  pool: {type: 'forks', maxWorkers: 1, minWorkers: 1},
  maxConcurrency: 1,
  testTimeout: 180000,
  hookTimeout: 180000,
})
