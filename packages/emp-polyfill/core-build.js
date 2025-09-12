import builder from 'core-js-builder'

const bundle = await builder({
  // 入口模块/命名空间/数组，使用最小化的模块集合
  modules: [
    // 只包含必要的 ES2015+ 核心功能
    'core-js/es/promise',
    'core-js/es/symbol',
    'core-js/es/map',
    'core-js/es/set',
    'core-js/es/array/from',
    'core-js/es/array/find',
    'core-js/es/array/includes',
    'core-js/es/object/assign',
    'core-js/es/object/entries',
    'core-js/es/object/values',
  ],
  // 排除不必要的模块以减小体积
  exclude: [
    /^es\.math\./, // 排除数学相关扩展
    /^es\.date\./, // 排除日期相关扩展
    /^es\.number\./, // 排除数字相关扩展
    /^es\.string\.match/, // 排除字符串匹配相关
    /^es\.string\.replace/, // 排除字符串替换相关
    /^es\.string\.search/, // 排除字符串搜索相关
    /^es\.string\.split/, // 排除字符串分割相关
    /^esnext\./, // 排除实验性功能
    /^web\./, // 排除 Web API polyfill
    'es.number.constructor',
  ],
  // 针对现代移动设备的最小化目标
  targets: 'Android >= 7, iOS >= 10, not ie > 0',
  // 启用压缩和体积优化
  summary: {
    console: {size: true, modules: true}, // 显示详细的体积和模块信息
    comment: {size: true, modules: false}, // 在输出文件中包含体积信息
  },
  // 使用 bundle 格式进行最大化压缩
  format: 'bundle',
  // 输出到压缩文件
  filename: 'dist/core.min.js',
  // 启用压缩选项（如果 core-js-builder 支持）
  minify: true,
})

console.log('Bundle 构建完成，体积已优化')
