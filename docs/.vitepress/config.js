module.exports = {
  title: 'EMP',
  description: '基于下一代构建实现微前端解决方案',
  themeConfig: {
    repo: 'efoxTeam/emp',
    // logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'next',
    editLinks: true,
    editLinkText: '修改这页内容',

    nav: [
      // { text: '指引', link: '/guide/' },
      { text: '开发', link: '/develop/' },
      { text: '配置', link: '/config/' },
      { text: '插件', link: '/plugin/' },
    ],

    sidebar: {
      // '/guide/': 'auto',
      '/develop/': 'auto',
      '/config/': 'auto',
      '/plugins/': 'auto',
    }
  }
}