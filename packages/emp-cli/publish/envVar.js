#!/usr/bin/env node
const fs = require('fs')
const {parse} = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const path = require('path')
const prettier = require('prettier')

/**
 * 操作 env 变量值
 * @param {*} filePath
 * @param {*} env
 */
async function astOptEnv(filePath, env) {
  const code = fs.readFileSync(filePath, {
    encoding: 'utf8',
  })

  const ast = parse(code, {
    sourceType: 'script',
  })

  traverse(ast, {
    // 當遍歷到 变量声明 語句相關的節點會執行這個方法
    VariableDeclarator(path) {
      if (path.node.id.name === 'env') {
        path.node.init.value = env
      }
    },
  })
  return generate(ast).code
}

async function main() {
  // 截取命令行参数
  const env = process.argv.slice(2)[0]
  const debugFilePath = path.join(__dirname, '../helpers/logger.js')
  const code = await astOptEnv(debugFilePath, env)
  const res = prettier.format(code, {semi: false, singleQuote: true, parser: 'babel'})
  fs.writeFileSync(debugFilePath, res)
}
main()
