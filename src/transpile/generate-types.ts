import { isRepeatable, SyntaxMap } from "../parser/types.ts"


type Type = {
    [role: string]: FieldType
}

type FieldType = {
    /* optional:boolean, */
    many: boolean
    types: string[]
}

export function generateAstType(
    syntaxName: string,
    syntaxes: SyntaxMap,
    ast: Type = {},
) {

    syntaxes[syntaxName].forEach(m => {

        if (m.role && m.types) {

            if (!ast[m.role]) {
                ast[m.role] = { many: isRepeatable(m.number), types: [] }
            }

            m.types.forEach(t => {
                const isString = syntaxes[t].length === 1 && syntaxes[t][0].reduce
                ast[m.role!].types.push(isString ? 'string' : t)
            })

        }

        if (m.expand && m.types) {
            m.types.forEach(x => generateAstType(x, syntaxes, ast))
        }

    })

    return ast
}


export function toTsType(td: FieldType) {

    // console.log(td)

    const taggedUnion = td.types.map(x => x.replace('-', '_')).reduce((a, b) => a + ' | ' + b)

    if (td.many && td.types.length > 1) {
        return `(${taggedUnion})[]`
    }

    if (td.many && td.types.length === 1) {
        return `${taggedUnion}[]`
    }


    return taggedUnion

}

export function toTsTypeFull(t: { [role: string]: FieldType }) {

    const x = Object.entries(t).map(e => `${e[0]} : ${toTsType(e[1])};`).reduce((a, b) => a + '\n' + b, '')
    return `{
        ${x}
    }`
}
