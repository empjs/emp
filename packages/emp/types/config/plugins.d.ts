import { WPChain } from "../helper/wpChain";
import { ResovleConfig } from "./";
export declare type ConfigPluginOptions = {
    wpChain: WPChain;
    config: ResovleConfig;
};
export declare type ConfigPluginType = (o: ConfigPluginOptions) => void | Promise<void>;
declare class ConfigPlugins {
    constructor();
    setup(): Promise<void>;
}
declare const _default: ConfigPlugins;
export default _default;
