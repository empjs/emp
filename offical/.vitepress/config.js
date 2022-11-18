import { defineConfig } from 'vitepress'
import { version } from '../../packages/emp/package.json'
export default defineConfig({
	lang: 'zh-CN',
	title: 'EMP',
	description: '下一代微前端构建方案',
	//
	// lastUpdated: true,
	// cleanUrls: 'without-subfolders',
	//
	head: [['meta', { name: 'theme-color', content: '#3700b3' }]],

	markdown: {
		headers: {
			level: [0, 0]
		}
	},
	//
	//
	themeConfig: {
		//
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/efoxTeam/emp' }
		],
		//
		nav: [
			{ text: '开发', link: '/develop/', activeMatch: '/develop/' },
			{ text: '配置', link: '/config/', activeMatch: '/config/' },
			{ text: '插件', link: '/plugin/', activeMatch: '/plugin/' },
			{ text: `v${version}`, link: 'https://github.com/efoxTeam/emp' },
		],

		sidebar: {
			'/develop/': [
				{
					text: '开发',
					items: [
						{ text: '安装', link: '/develop/' },
						{ text: '指令', link: '/develop/cli' },
						{ text: '微前端', link: '/develop/empshare' },
						{ text: '多入口', link: '/develop/multi' },
						{ text: 'dotenv', link: '/develop/dotenv' },
						{ text: 'Typescript', link: '/develop/typescript' },
						{ text: '库模式', link: '/develop/lib' },
					]
				}
			],
			'/config/': [
				{
					text: '配置',
					items: [
						{ text: '配置入口', link: '/config/' },
						{ text: '全局', link: '/config/global' },
						{ text: '构建', link: '/config/build' },
						{ text: 'CSS', link: '/config/css' },
						{ text: '模块编译', link: '/config/module' },
						{ text: 'DTS', link: '/config/dts' },
						{ text: '服务', link: '/config/server' },
						{ text: '调试', link: '/config/debug' },
					]
				}
			],
			'/plugin/': [
				{
					text: '插件',
					items: [
						{ text: '官方插件', link: '/plugin/' },
						{ text: '规范', link: '/plugin/rule' },
					]
				}
			],
		},

		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2022 Ken Xu'
		}
	}
})
