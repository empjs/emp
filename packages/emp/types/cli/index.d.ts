import { cliOptionsType, modeType } from "../types";
declare class EMPScript {
    constructor();
    /**
     * 执行命令相关脚本
     * @param name
     */
    exec(name: string, mode: modeType, cliOptions: cliOptionsType, pkg: any): Promise<void>;
}
declare const _default: EMPScript;
export default _default;
