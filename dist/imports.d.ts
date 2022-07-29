export declare function parseId(id: any): {
    query: {
        [k: string]: any;
    } | null;
    path: any;
};
export declare function generateImports(source: any, options: any): {
    code: string;
    source: any;
};
