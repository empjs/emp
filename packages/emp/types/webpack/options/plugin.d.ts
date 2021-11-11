import { cliOptionsType } from "../../types";
declare class WpPluginOptions {
    htmlWebpackPlugin: {
        title: string;
        template: string;
        chunks: string[];
        favicon: string;
        files: {
            css: string[];
            js: string[];
        };
        scriptLoading: string;
        minify: false | {
            removeComments: boolean;
            collapseWhitespace: boolean;
            removeRedundantAttributes: boolean;
            useShortDoctype: boolean;
            removeEmptyAttributes: boolean;
            removeStyleLinkTypeAttributes: boolean;
            keepClosingSlash: boolean;
            minifyJS: boolean;
            minifyCSS: boolean;
            minifyURLs: boolean;
        };
    };
    moduleFederation: {};
    definePlugin: cliOptionsType;
    private isESM;
    constructor();
    private setDefinePlugin;
    private setModuleFederation;
    private setHtmlWebpackPlugin;
}
export default WpPluginOptions;
