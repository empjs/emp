export default function prepareUrls(protocol: any, host: string, port: number, pathname?: string): {
    lanUrlForConfig: any;
    lanUrlForTerminal: string;
    localUrlForTerminal: string;
    localUrlForBrowser: string;
};
