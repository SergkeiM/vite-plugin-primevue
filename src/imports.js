import { camelize, capitalize } from 'vue'
import { parse as parseUrl, URLSearchParams } from 'url'

function createSet (matches){
    return new Set(Array.from(matches, i => {
        return {
            symbol: i[1],
            component: camelize(i[2]).substr(1).toLowerCase(),
            name: capitalize(camelize(i[2])),
            index: i.index,
            length: i[0].length,
        }
    }))
}

function addImport (imports, name, as, from) {
    if (!imports.has(from)) {
        imports.set(from, [])
    }

    imports.get(from).push(`default as ${as}`)
}

function getImports (source, options) {
    const { components } = parseTemplate(source)
    const resolvedComponents = []
    const imports = new Map()

    if (components.size) {
        components.forEach(component => {
            if (component.name.startsWith('V') || component.name.startsWith('P')) {
                resolvedComponents.push(component)
            }
        })
    }

    resolvedComponents.forEach(component => {
        addImport(imports, component.name, component.symbol, `primevue/${component.component}`)
    })


    return {
        imports,
        components: resolvedComponents
    }
}

function parseTemplate (source) {

    const components = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveComponent\("([\w-.]+)"\);?/gm))

    return {
        components
    }
}

export function parseId (id) {
    const { query, pathname } = parseUrl(id)

    return {
        query: query ? Object.fromEntries(new URLSearchParams(query)) : null,
        path: pathname ?? id
    }
}

export function generateImports (source, options) {
    const { imports, components } = getImports(source, options)

    let code = ''

    if (components.length) {
        code += '\n\n/* PrimeVue */\n'

        Array.from(imports).sort((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
            .forEach(([from, names]) => {
                code += `import { ${names.join(', ')} } from "${from}"\n`
                
            })

        code += '\n'

        source = components.reduce((acc, v) => {
            return acc.slice(0, v.index) + ' '.repeat(v.length) + acc.slice(v.index + v.length)
        }, source)
    }

    return { code, source }
}