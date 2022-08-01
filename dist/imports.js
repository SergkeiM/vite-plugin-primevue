"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImports = exports.parseId = void 0;
const vue_1 = require("vue");
const url_1 = require("url");
const importMap = require("./map.json");
function createSet(matches) {
    return new Set(Array.from(matches, i => {
        return {
            symbol: i[1],
            name: (0, vue_1.camelize)(i[2]).toLowerCase(),
            index: i.index,
            length: i[0].length,
        };
    }));
}
function addImport(imports, name, as, from) {
    if (!imports.has(from)) {
        imports.set(from, []);
    }
    imports.get(from).push(`default as ${as}`);
}
function getImports(source, options) {
    const { components } = parseTemplate(source);
    const resolvedComponents = [];
    const imports = new Map();
    if (components.size) {
        components.forEach(component => {
            if (component.name in importMap) {
                resolvedComponents.push(component);
            }
        });
    }
    resolvedComponents.forEach(component => {
        const src = options.sfc ? `${importMap[component.name]}/sfc` : importMap[component.name];
        addImport(imports, component.name, component.symbol, src);
    });
    return {
        imports,
        components: resolvedComponents
    };
}
function parseTemplate(source) {
    const components = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveComponent\("([\w-.]+)"\);?/gm));
    return {
        components
    };
}
function parseId(id) {
    const { query, pathname } = (0, url_1.parse)(id);
    return {
        query: query ? Object.fromEntries(new url_1.URLSearchParams(query)) : null,
        path: pathname !== null && pathname !== void 0 ? pathname : id
    };
}
exports.parseId = parseId;
function generateImports(source, options) {
    const { imports, components } = getImports(source, options);
    let code = '';
    if (components.length) {
        code += '\n\n/* PrimeVue */\n';
        Array.from(imports).sort((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
            .forEach(([from, names]) => {
            code += `import { ${names.join(', ')} } from "${from}"\n`;
        });
        code += '\n';
        source = components.reduce((acc, v) => {
            return acc.slice(0, v.index) + ' '.repeat(v.length) + acc.slice(v.index + v.length);
        }, source);
    }
    return { code, source };
}
exports.generateImports = generateImports;
//# sourceMappingURL=imports.js.map