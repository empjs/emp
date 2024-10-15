import { defineConfig } from "@empjs/cli";
import pluginStylus from '@empjs/plugin-stylus'
import vue from "@empjs/plugin-vue2";
// import pluginReact from '@empjs/plugin-react'
// import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig((store) => {
	return {
		appEntry: "main.js",
		plugins: [
            pluginStylus(),
			vue(),
            
			//   pluginReact(),
			//   pluginRspackEmpShare({
			//     empRuntime: {
			//       runtimeLib: `https://unpkg.com/@empjs/share@3.1.5/output/sdk.js`,
			//       frameworkLib: `https://unpkg.com/@empjs/libs-18@0.0.1/dist`,
			//       frameworkGlobal: 'EMP_ADAPTER_REACT',
			//       framework: 'react',
			//     },
			//   }),
		],
		build: {
			polyfill: {
				entryCdn: "https://unpkg.com/@empjs/polyfill@0.0.1/dist/es.js",
			},
		},
		server: {
			port: 1801,
			open: false,
		},
		// chain(config) {
		// 	config.module
		// 		.rule("stylus")
		// 		.test(/\.styl$/)
		// 		.use("style-loader")
		// 		.loader("style-loader")
		// 		.end()
		// 		.use("css-loader")
		// 		.loader("css-loader")
		// 		.end()
		// 		.use("stylus-loader")
		// 		.loader("stylus-loader")
		// 		.options({
		// 			stylusOptions: {
		// 				// use: ["nib"],
		// 				// include: [path.join(__dirname, "src/styl/config")],
		// 				// import: ["nib", path.join(__dirname, "src/styl/mixins")],
		// 				// define: [
		// 				// 	["$development", process.env.NODE_ENV === "development"],
		// 				// 	["rawVar", 42, true],
		// 				// ],
		// 				includeCSS: false,
		// 				resolveURL: true,
		// 				lineNumbers: true,
		// 				hoistAtrules: true,
		// 				compress: true,
		// 			},
		// 		});
		// },
	};
});
