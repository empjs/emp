import * as path from "path";
import { defineConfig } from "rspress/config";
import { rsbuildPluginOverview } from "./theme/rsbuildPluginOverview";
import sitemap from "rspress-plugin-sitemap";
//
export default defineConfig({
	// lang: 'zh',
	base: "/",
	root: path.join(__dirname, "docs"),
	title: "EMP - 基于Rust生态打造的高性能前端构建系统",
	description: "EMP, Rust, high-performance, frontend build system",
	icon: "/rspress-icon.png",
	lang: "zh",
	logo: {
		light: "/rspress-light-logo.png",
		dark: "/rspress-dark-logo.png",
	},
	globalStyles: path.join(__dirname, "theme", "index.scss"),
	markdown: {
		checkDeadLinks: true,
	},
	mediumZoom: {
		selector: ".mediumZoom img",
	},
	themeConfig: {
		footer: {
			message: "© 2019-2024 EMP TREAM Inc. All Rights Reserved.",
		},
		socialLinks: [
			{ icon: "github", mode: "link", content: "https://github.com/empjs/emp" },
		],
		locales: [
			{
				lang: "en",
				label: "English",
				title: "emp",
				description: "The Rspack-based build tool for the web",
			},
			{
				lang: "zh",
				label: "简体中文",
				title: "emp",
				outlineTitle: "目录",
				prevPageText: "上一页",
				nextPageText: "下一页",
				description: "基于Rust生态打造的高性能前端构建系统",
			},
		],
	},
	plugins: [
		sitemap({ domain: "https://empjs.dev" }),
	],
	builderConfig: {
		plugins: [rsbuildPluginOverview],
		/* html: {
			tags: [
				{
					tag: 'script',
					attrs: {
						src: 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.1.0-beta.3/libs/cn/index.js'
					},
				},
				{
					tag: 'script',
					children: `new CozeWebSDK.WebChatClient({
			config: {
			  bot_id: '7469719010817703955',
			},
			componentProps: {
			  title: 'EMP智能体',
			},
		  });`
				}
			]
		}, */
		source: {
			alias: {
				"@components": path.join(__dirname, "theme/components"),
				"@en": path.join(__dirname, "docs/en"),
				"@zh": path.join(__dirname, "docs/zh"),
			},
		},
	},
});
