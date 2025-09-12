import {defineConfig} from 'tsup'

export default defineConfig(({watch}) => {
  return {
    entry: [
      // 'src/index.ts',
      // 'src/full.ts',
      // 'src/stable.ts',
      // 'src/actual.ts',
      'src/es.ts',
      // 'src/null.ts',
      // 'src/stage2.ts',
      'src/c71.ts',
    ],
    // target: 'es2015', // 改为 es2015 以减小体积
    target: 'es5',
    format: ['iife'],
    // sourcemap: false, // 生产环境关闭 sourcemap
    clean: true,
    // dts: false, // 关闭类型声明文件生成
    env: {NODE_ENV: 'production'},
    minify: 'terser', // 使用 terser 进行更好的压缩
    // minify: true,
    watch: watch,
    splitting: false, // 关闭代码分割
    treeshake: true, // 启用 tree shaking
    esbuildOptions(options, context) {
      options.legalComments = 'none'
      options.drop = ['console', 'debugger'] // 移除 console 和 debugger
      options.mangleProps = /^_/ // 混淆以 _ 开头的属性
      options.minifyWhitespace = true
      options.minifyIdentifiers = true
      options.minifySyntax = true
    },
    outExtension: ({format}) => {
      return {
        js: '.js', // 使用 .min.js 后缀
      }
    },
    async onSuccess() {
      console.log('✅ 构建成功！产物已优化压缩')
    },
  }
})
