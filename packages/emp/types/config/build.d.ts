import { JscConfig } from '@efox/swc-loader';
export declare type BuildOptions = {
    /**
     * swc & esbuild 是否异步构建
     * @default false
     */
    sync?: boolean;
    /**
     * 生成代码 参考 https://swc.rs/docs/configuring-swc#jsctarget
     */
    target?: JscConfig['target'];
    /**
     * 生成代码目录
     * @default 'dist'
     */
    outDir?: string;
    /**
     * 生成静态目录
     * @default 'assets'
     */
    assetsDir?: string;
    /**
     * 是否压缩
     * @default true
     */
    minify?: boolean;
    /**
     * 是否生成 source map
     * @default true
     */
    sourcemap?: boolean;
    /**
     * 是否使用 library模式
     * @default true
     */
    useLib?: boolean;
    /**
     * 是否清空生成文件夹
     * @default true
     */
    emptyOutDir?: boolean;
};
export declare const initBuild: (op?: BuildOptions | undefined) => Required<BuildOptions>;
