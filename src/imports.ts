import { camelize } from 'vue'
import { parse as parseUrl, URLSearchParams } from 'url'
import * as importMap from './map.json'
import { VitePrimeViewPluginOptions } from './types'

export type ComponentListJson = {[index: string]:any}

let importMapList = importMap as ComponentListJson

export type ComponentItem = {
    symbol: string
    name: string
    index: number | undefined
    length: number
}

function createSet (matches:IterableIterator<RegExpMatchArray>){
    return new Set(Array.from(matches, (i:RegExpMatchArray):ComponentItem => {
        return {
            symbol: i[1],
            name: camelize(i[2]).toLowerCase(),
            index: i.index,
            length: i[0].length,
        }
    }))
}

function addImport (imports:Map<string, any[]>, name:string, as:string, from:string) {
    if (!imports.has(from)) {
        imports.set(from, [])
    }

    imports.get(from)?.push(`default as ${as}`)
}

function getImports (source: string, options:VitePrimeViewPluginOptions) {
    const { components } = parseTemplate(source)
    const resolvedComponents:ComponentItem[] = []
    const imports = new Map()

    if (components.size) {
        components.forEach(component => {
            if (component.name in importMap) {
                resolvedComponents.push(component)
            }
        })
    }

    resolvedComponents.forEach(component => {

        const src = options.sfc ? `${importMapList[component.name]}/sfc`: importMapList[component.name]

        addImport(imports, component.name, component.symbol, src)
    })

    return {
        imports,
        components: resolvedComponents
    }
}

function parseTemplate (source:string) {

    const components = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveComponent\("([\w-.]+)"\);?/gm))

    return {
        components
    }
}

export function parseId (id:string) {
    const { query, pathname } = parseUrl(id)

    return {
        query: query ? Object.fromEntries(new URLSearchParams(query)) : null,
        path: pathname ?? id
    }
}

export function generateImports (source: string, options:VitePrimeViewPluginOptions) {
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
            return acc.slice(0, v.index) + ' '.repeat(v.length) + acc.slice((v.index??0) + v.length)
        }, source)
    }

    return { code, source }
}
