import webpack from 'webpack';
import { SWCLoaderOptions } from './swcType';
declare function SWCLoader(this: webpack.LoaderContext<SWCLoaderOptions>, source: string): Promise<void>;
export default SWCLoader;
