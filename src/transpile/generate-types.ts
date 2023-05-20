import { isRepeatable, SyntaxMap } from "../parser/types.ts"

type AstType = {
    name: string
    fields: Field[]
}

type Field = {
    name: string
    optional: boolean
    multiple: boolean
    types: string[]
}

function safeName(name: string) {
    return name.replace('-', '_')
}

function typeToTs(type: AstType): string {

    return `
    type ${safeName(type.name)} = {
        ${type.fields.map(x => fieldToTs(x)).reduce((a, b) => a + '\n\t' + b)}
    }
    `
}

function fieldToTs(field: Field): string {

    const types = field.types.map(x => safeName(x)).reduce((a, b) => a + ' | ' + b)
    const name = field.name + (field.optional ? '?' : '')

    if (field.types.length > 1 && field.multiple) {
        return `${name}: (${types})[]`
    }

    if (field.types.length === 1 && field.multiple) {
        return `${name}: ${types}[]`
    }

    return `${name}: ${types}`
}

console.log(typeToTs({
    name: 'noun-phrase',
    fields: [
        { name: 'head', types: ['string'], optional: false, multiple: false },
        { name: 'modifiers', types: ['string'], optional: false, multiple: true },
        { name: 'owner', types: ['string', 'noun-phrase'], optional: true, multiple: false },
    ]
}))




// export function generateAstType(
//     syntaxName: string,
//     syntaxes: SyntaxMap,
//     ast: Type = {},
// ) {

//     syntaxes[syntaxName].forEach(m => {

//         if (m.role && m.types) {

//             if (!ast[m.role]) {
//                 ast[m.role] = { multiple: isRepeatable(m.number), types: [] }
//             }

//             m.types.forEach(t => {
//                 const isString = syntaxes[t].length === 1 && syntaxes[t][0].reduce
//                 ast[m.role!].types.push(isString ? 'string' : t)
//             })

//         }

//         if (m.expand && m.types) {
//             m.types.forEach(x => generateAstType(x, syntaxes, ast))
//         }

//     })

//     return ast
// }


// export function toTsType(td: Field) {

//     // console.log(td)

//     const taggedUnion = td.types.map(x => x.replace('-', '_')).reduce((a, b) => a + ' | ' + b)

//     if (td.multiple && td.types.length > 1) {
//         return `(${taggedUnion})[]`
//     }

//     if (td.multiple && td.types.length === 1) {
//         return `${taggedUnion}[]`
//     }


//     return taggedUnion

// }

// export function toTsTypeFull(t: { [role: string]: Field }) {

//     const x = Object.entries(t).map(e => `${e[0]} : ${toTsType(e[1])};`).reduce((a, b) => a + '\n' + b, '')
//     return `{
//         ${x}
//     }`
// }


