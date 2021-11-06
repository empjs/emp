import webpack from 'webpack';
import { Options } from '@swc/core';
declare type SWCLoaderType = Options & {
    sync?: boolean;
    baseUrl?: string;
};
declare function SWCLoader(this: webpack.LoaderContext<SWCLoaderType>, source: string): Promise<void>;
export default SWCLoader;
