import {describe, expect, test} from '@rstest/core'
import {parseCreateIntent} from '../src/agent-create/intent'

describe('parseCreateIntent', () => {
  test('parses React host and Vue user remote from Chinese intent', () => {
    expect(parseCreateIntent('React 主应用 + Vue 子应用')).toEqual({
      raw: 'React 主应用 + Vue 子应用',
      host: {framework: 'react', name: 'host'},
      remotes: [{framework: 'vue', name: 'user'}],
    })
  })

  test('parses Vue user remote from English intent', () => {
    expect(parseCreateIntent('react host with vue remote').remotes).toEqual([
      {framework: 'vue', name: 'user'},
    ])
  })

  test('rejects empty intent', () => {
    expect(() => parseCreateIntent('')).toThrow(/create 命令需要项目意图/)
  })

  test('rejects unsupported P0 stack', () => {
    expect(() => parseCreateIntent('Vue 主应用 + React 子应用')).toThrow(
      /P0 仅支持 React 主应用 \+ Vue 子应用/,
    )
  })
})
