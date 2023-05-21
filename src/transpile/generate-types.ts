import { isNecessary, isRepeatable, Member, Syntax, SyntaxMap } from "../parser/types.ts"

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

function typeToTs(type: AstType): string {

    return `
    type ${safeName(type.name)} = {
        type : '${type.name}'
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

function generateType(syntaxName: string, syntaxes: SyntaxMap): AstType {

    const syntax = syntaxes[syntaxName]
    const result: AstType = { name: syntaxName, fields: {} }

    for (const member of syntax) {

        if (member.role) {
            const field = generateField(member, syntaxes)
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
        }

    }

    return result
}

function generateField(member: Member, syntaxes: SyntaxMap): Field {

    const partRes = {
        name: member.role!,
        optional: !isNecessary(member.number),
        multiple: isRepeatable(member.number),
    }

    if (member.literals) {
        return { ...partRes, types: ['string'] }
    }

    return {
        ...partRes,
        types: member.types.map(t => isLiteral(syntaxes[t]) ? 'string' : t),
    }

}

function safeName(name: string) {
    return name.replace('-', '_')
}

function isLiteral(syntax: Syntax) {
    return syntax.length === 1 && syntax[0].reduce
}

export function generateTypes(syntaxNames: string[], syntaxes: SyntaxMap) {
    let result = ''

    syntaxNames.forEach(t => {
        result += typeToTs(generateType(t, syntaxes)) + '\n\n'
    })

    return result
}

