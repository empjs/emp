import { Configuration } from 'webpack-dev-server';
export declare type ServerOptions = {
    /**
     * 访问 host
     * @default '0.0.0.0'
     */
    host?: string;
    /**
     * 访问 端口
     * @default 8000
     */
    port?: number;
    /**
     * 自动切换端口
     * @default false
     */
    strictPort?: boolean;
    https?: Configuration['https'];
    proxy?: Configuration['proxy'] | boolean;
    /**
     * 自动打开
     * @default false
     */
    open?: Configuration['open'];
    /**
     * 热重载
     * @default true
     */
    hot?: Configuration['hot'];
};
export declare const initServer: (op?: ServerOptions | undefined) => Required<ServerOptions>;
