import { Configuration } from 'webpack';
import WpPluginOptions from "./plugin";
import WpModuleOptions from "./module";
import { externalAssetsType } from "../../types";
declare class WpOptions {
    output: Configuration['output'];
    resolve: Configuration['resolve'];
    mode: Configuration['mode'];
    stats: Configuration['stats'];
    plugins?: WpPluginOptions;
    modules?: WpModuleOptions;
    entry?: Configuration['entry'];
    external: Configuration['externals'];
    externalAssets: externalAssetsType;
    constructor();
    setup(mode: Configuration['mode']): Promise<void>;
    setEntry(): Promise<any>;
    setOput(): void;
    setResolve(): void;
    setStats(): void;
}
export default WpOptions;
