import { VitePrimeViewPluginOptions } from './types';
export declare type ComponentListJson = {
    [index: string]: any;
};
export declare type ComponentItem = {
    symbol: string;
    name: string;
    index: number | undefined;
    length: number;
};
export declare function parseId(id: string): {
    query: {
        [k: string]: string;
    } | null;
    path: string;
};
export declare function generateImports(source: string, options: VitePrimeViewPluginOptions): {
    code: string;
    source: string;
};
