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
	};
});
