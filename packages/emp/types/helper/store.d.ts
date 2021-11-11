import { cliOptionsType, modeType } from "../types";
import { ResovleConfig } from "../config";
import WpOptions from "../webpack/options";
declare class GlobalStore {
    /**
     * EMP Version
     * @default package version
     */
    pkgVersion: string;
    /**
     * 项目根目录绝对路径
     * @default process.cwd()
     */
    root: string;
    /**
     * emp 内部根路径
     * @default path.resolve(__dirname, '../../')
     */
    empRoot: string;
    /**
     * 项目配置
     */
    config: ResovleConfig;
    /**
     * 获取项目 根目录绝对路径
     * @param relativePath
     * @returns
     */
    resolve: (relativePath: string) => string;
    /**
     * 获取项目 emp内部根目录绝对路径
     * @param relativePath
     * @returns
     */
    empResolve: (relativePath: string) => string;
    /**
     * 源码地址
     */
    appSrc: string;
    /**
     * 源码生成目录
     */
    outDir: string;
    /**
     * 静态文件目录
     */
    publicDir: string;
    /**
     * 命令行变量
     */
    cliOptions: cliOptionsType;
    /**
     * webpack options 全局变量 所有webpack配置收归到这里
     */
    wpo: WpOptions;
    constructor();
    /**
     * setConfig 设置全局配置
     * @param mode webpack mode
     * @param cliOptions command options
     * @param pkg package.json data
     */
    setConfig(mode: modeType, cliOptions: cliOptionsType, pkg: any): Promise<void>;
}
declare const _default: GlobalStore;
export default _default;
