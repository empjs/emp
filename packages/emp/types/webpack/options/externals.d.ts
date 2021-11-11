import { ResovleConfig } from "../../config";
import { externalAssetsType } from "../../types";
export declare type ExternalsItemType = {
    /**
     * 模块名
     * @example react-dom
     */
    module?: string;
    /**
     * 全局变量
     * @example ReactDom
     */
    global?: string;
    /**
     * 入口地址
     * @example http://
     */
    entry: string;
    /**
     * 类型入口
     * @default js
     * @enum js | css
     * @example css
     */
    type?: string;
};
export declare type ExternalsType = (config: ResovleConfig) => ExternalsItemType[] | Promise<ExternalsItemType[]> | ExternalsItemType[];
declare class WpExternalsOptions {
    constructor();
    setup(externals: any, externalAssets: externalAssetsType): Promise<void>;
}
declare const _default: WpExternalsOptions;
export default _default;
