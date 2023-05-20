import { isNecessary, isRepeatable, Member, Syntax, SyntaxMap } from "../parser/types.ts"
import { syntaxes } from "./grammar.ts"

type AstType = {
    name: string
    fields: { [role: string]: Field }
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
        ${Object.values(type.fields).map(x => fieldToTs(x)).reduce((a, b) => a + '\n\t' + b)}
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

// console.log(typeToTs({
//     name: 'noun-phrase',
//     fields: [
//         { name: 'head', types: ['string'], optional: false, multiple: false },
//         { name: 'modifiers', types: ['string'], optional: false, multiple: true },
//         { name: 'owner', types: ['string', 'noun-phrase'], optional: true, multiple: false },
//     ]
// }))


function generateType(syntaxName: string, syntaxes: SyntaxMap): AstType {

    const syntax = syntaxes[syntaxName]
    const result: AstType = { name: syntaxName, fields: {} }

    for (const member of syntax) {

        if (member.role) {
            const field = generateField(member, syntaxes)
            // result.fields.push(field)
            result.fields[field.name] = field
        }

        if (member.expand && member.types) {

            const fields = member.types.flatMap(x => Object.values(generateType(x, syntaxes).fields))
            const fields2 = fields.map(f => ({ ...f, optional: !isNecessary(member.number) }))

            fields2.forEach(f => {
                const old = result.fields[f.name]

                if (!old) {
                    result.fields[f.name] = f
                    return
                }

                result.fields[f.name] = { ...f, types: f.types.concat(old.types) }
            })

            // const expandedFields = member.types.flatMap(x => generateType(x, syntaxes).fields).map(f => ({ ...f, optional: !isNecessary(member.number) }))
            // result.fields.push(...expandedFields)

        }

    }

    return result
}

function generateField(member: Member, syntaxes: SyntaxMap): Field {

    if (member.literals) {
        return {
            name: member.role!,
            types: ['string'],
            optional: !isNecessary(member.number),
            multiple: isRepeatable(member.number),
        }
    }

    return {
        name: member.role!,
        types: member.types.map(t => isLiteral(syntaxes[t]) ? 'string' : t),
        optional: !isNecessary(member.number),
        multiple: isRepeatable(member.number),
    }

}


function isLiteral(syntax: Syntax) {
    return syntax.length === 1 && syntax[0].reduce
}

console.log(typeToTs(generateType('noun-phrase', syntaxes)))


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


// console.log(generateType('noun-phrase', syntaxes))