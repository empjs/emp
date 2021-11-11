import { container } from 'webpack';
import { BuildOptions } from "./build";
import { ServerOptions } from "./server";
import { modeType } from "../types";
import { ExternalsType } from "../webpack/options/externals";
import { ConfigPluginType } from "./plugins";
declare type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0];
export declare type EMPConfig = {
    /**
     * 项目根目录绝对路径 提供给 plugin 使用 一般不需要设置
     * @default process.cwd()
     */
    root?: string;
    /**
     * 项目代码路径
     * @default 'src'
     */
    appSrc?: string;
    /**
     * 项目代码入口文件 如 `src/index.js`
     * @default 'index.js'
     */
    appEntry?: string;
    /**
     * publicPath 根路径 可参考webpack
     * 库模式 默认为 / 避免加入 auto判断
     * 业务模式默认为 auto
     * @default '/'
     */
    base?: string;
    /**
     * 静态文件路径
     * @default 'public'
     */
    publicDir?: string;
    /**
     * 缓存目录
     * @default 'node_modules/.emp-cache'
     */
    cacheDir?: string;
    /**
     * 调试模式为 development
     * 构建模式为 production
     * 正式环境为 none
     */
    mode?: modeType;
    /**
     * 全局环境替换
     */
    define?: Record<string, any>;
    plugins?: ConfigPluginType[];
    server?: ServerOptions;
    build?: BuildOptions;
    externals?: ExternalsType;
    /**
     * 日志级别
     * @default 'info'
     */
    logLevel?: string;
    /**
     * module federation 配置
     */
    moduleFederation?: MFOptions;
    /**
     * 启用 import.meta
     * 需要在 script type=module 才可以执行
     * @default false
     */
    useImportMeta?: boolean;
};
export interface ConfigEnv {
    mode: modeType;
    [key: string]: any;
}
export declare type EMPConfigFn = (env?: ConfigEnv) => EMPConfig | Promise<EMPConfig>;
export declare type EMPConfigExport = EMPConfig | Promise<EMPConfig> | EMPConfigFn;
export declare function defineConfig(config: EMPConfigExport): EMPConfigExport;
export declare type ResovleConfig = Required<EMPConfig> & {
    build: Required<BuildOptions>;
    server: Required<ServerOptions>;
    moduleFederation?: MFOptions;
};
export declare const initConfig: (op?: EMPConfig, mode?: string) => any;
export {};
