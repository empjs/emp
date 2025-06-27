import path from 'node:path'
import type {RsbuildPlugin} from '@rsbuild/core'
import glob from 'fast-glob'
import type {Group} from '../components/Overview'

const camelCase = (input: string): string => input.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
const prifixName = (input: string) => {
  let cb = input
  cb += '.'
  if (input === 'base') return ''
  return cb
}
async function configGroup() {
  const root = path.join(__dirname, '../docs/zh/config/')
  const globPath = path.join(root, '**/*.{mdx,md}')

  const files = await glob(globPath)
  // console.log(files);
  const groups: Group[] = []

  for (const file of files) {
    const filename = file.replace(root, '').replace(/\.mdx?/, '')
    const pair = filename.split('/')

    if (pair.length < 2) {
      continue
    }

    const group = groups.find(group => group.name === pair[0])
    const item = {
      text: `${prifixName(camelCase(pair[0]))}${camelCase(pair[1])}`,
      link: `/config/${filename}`,
    }
    if (group) {
      group.items.push(item)
    } else {
      groups.push({
        name: camelCase(pair[0]),
        items: [item],
      })
    }
  }

  // const order = [
  // 	"source",
  // 	"output",
  // 	"html",
  // 	"server",
  // 	"security",
  // 	"moduleFederation",
  // 	"dev",
  // 	"tools",
  // 	"performance",
  // 	"plugins",
  // ];

  // groups.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  return groups
}
async function pluginGroup() {
  const root = path.join(__dirname, '../docs/zh/plugin/')
  const globPath = path.join(root, '**/*.{mdx,md}')

  const files = await glob(globPath)
  // console.log(files);
  const groups: Group[] = []

  for (const file of files) {
    const filename = file.replace(root, '').replace(/\.mdx?/, '')
    const pair = filename.split('/')

    if (pair.length < 2) {
      continue
    }

    const group = groups.find(group => group.name === pair[0])
    const item = {
      // text: `@empjs/${pair[1]}`,
      text: `${pair[1]}`,
      link: `/plugin/${filename}`,
      npm: `@empjs/${pair[1]}`,
    }
    if (group) {
      group.items.push(item)
    } else {
      groups.push({
        name: camelCase(pair[0]),
        items: [item],
      })
    }
  }
  return groups
}
export const rsbuildPluginOverview: RsbuildPlugin = {
  name: 'rsbuild-doc:overview',
  async setup(api) {
    const configs = await configGroup()
    const plugins = await pluginGroup()
    api.modifyRsbuildConfig((config, {mergeRsbuildConfig}) => {
      return mergeRsbuildConfig(config, {
        source: {
          define: {
            OVERVIEW_CONFIGS: JSON.stringify(configs),
            OVERVIEW_PLUGINS: JSON.stringify(plugins),
          },
        },
      })
    })
  },
}
