import webpack from 'webpack';
import { ResovleConfig } from '@efox/emp/index';
declare function SWCLoader(this: webpack.LoaderContext<ResovleConfig>, source: string): Promise<void>;
export default SWCLoader;
