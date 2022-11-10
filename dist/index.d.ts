import { ResolvedConfig } from 'vite';
declare function importPlugin(_options?: {}): {
    name: string;
    configResolved(config: ResolvedConfig): void;
    transform(code: string, id: string): Promise<{
        code: string;
        map: null;
    } | null>;
};
export default importPlugin;
