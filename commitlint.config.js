module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 类型定义
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'doc', // 文档注释
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'style', // 代码格式(不影响代码运行的变动)
        'revert', // 回退
      ],
    ],
    // subject 大小写不做校验
    // 自动部署的BUILD ROBOT的commit信息大写，以作区别
    'subject-case': [0],
  },
}
