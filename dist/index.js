"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const imports_1 = require("./imports");
function importPlugin(_options = {}) {
    const options = {
        sfc: false,
        ..._options
    };
    return {
        name: 'primevue:import',
        configResolved(config) {
            if (config.plugins.findIndex(plugin => plugin.name === 'primevue:import') < config.plugins.findIndex(plugin => plugin.name === 'vite:vue')) {
                throw new Error('PrimeVue plugin must be loaded after the vue plugin');
            }
        },
        async transform(code, id) {
            const { query, path } = (0, imports_1.parseId)(id);
            if ((!query && (0, path_1.extname)(path) === '.vue' && !/^import { render as _sfc_render } from ".*"$/m.test(code)) ||
                (query && 'vue' in query && (query.type === 'template' || (query.type === 'script' && query.setup === 'true')))) {
                const { code: imports, source } = (0, imports_1.generateImports)(code, options);
                return {
                    code: imports + source,
                    map: null,
                };
            }
            return null;
        }
    };
}
exports.default = importPlugin;
//# sourceMappingURL=index.js.map