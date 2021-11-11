import { Configuration } from 'webpack';
export declare type modeType = 'development' | 'production' | 'none' | undefined;
export declare type cliOptionsType = {
    [key: string]: string | number | boolean;
};
export declare type wpPathsType = {
    output: Configuration['output'];
};
export declare type externalAssetsType = {
    js: string[];
    css: string[];
};
