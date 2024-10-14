import { defineConfig, rspack } from "@empjs/cli";
import pluginReact from "@empjs/plugin-react";
import { pluginRspackEmpShare } from "@empjs/share";
//
export default defineConfig((store) => {
	const mfhost =
		"https://emp-demo-react18-host.pages.dev/demos/react18/react-host/dist/emp.js";
	// const mfhost = `http://localhost:1802/emp.js`
	const frameworkLib = "https://unpkg.com/@empjs/libs-18@0.0.1/dist";
	return {
		plugins: [
			pluginReact(),
			pluginRspackEmpShare({
				empRuntime: {
					frameworkLib,
					frameworkGlobal: "EMP_ADAPTER_REACT",
					framework: undefined, // 跨版本这里必须要配置为 undefined
					runtimeLib: "https://unpkg.com/@empjs/share@3.1.2/output/full.js",
				},
			}),
		],
		server: { port: 4002 },
		define: { mfhost },
		debug: { clearLog: false, showRsconfig: "x.config.json" },
		chain(config) {
			// config.plugin('definePlugin').tap(o => {
			//   o["process.env.helllo"] = `"123"`
			//   return o
			// })
			const defineMap = {};
			defineMap["process.env.oooop"] = "ooooo";
			// config.plugin("define").use(rspack.DefinePlugin, [
			// 	defineMap
			// ]);
			// 查找 DefinePlugin 并添加内容到 _args
			config.plugin("define").tap((args) => {
				const existingDefinePlugin = args.find(
					(plugin) => plugin instanceof rspack.DefinePlugin,
				);
				// if (existingDefinePlugin) {
				// 	// 假设要添加的内容

				// 	existingDefinePlugin[1] = {
				// 		...existingDefinePlugin[1],
				// 		...newDefineContent,
				// 	};
				// }
        // args = defineMap
				return defineMap;
			});
		},
	};
});
