import { first } from "../utils/first";
import { CharStream } from "./char-stream";
import { isNecessary, isRepeatable, LiteralMember, Member, Role, Syntax, syntaxes, AstType, roles } from "./csts";

type AstNode =
    string
    | string[]
    | AstNode[]
    | { [x in Role]?: AstNode }


export function parseTry(syntaxList: AstType[], cs: CharStream) {

    for (const syntaxName of syntaxList) {

        const memento = cs.getPos()
        const syntax = syntaxes[syntaxName] // state!
        const tree = parseSyntax(syntax, cs)

        if (tree) {
            return tree //{ ...tree, type: syntaxName } as SyntaxTree // remove cast // TODO: add type
        }

        cs.backTo(memento)
    }

}

export function parseSyntax(syntax: Syntax, cs: CharStream): AstNode | undefined {

    const ast: AstNode = {}

    for (const member of syntax) {

        const node = parseMemberRepeated(member, cs)

        if (!node && isNecessary(member.number)) {
            return undefined
        }

        if (!node) { // and not isNecessary
            continue
        }

        if (member.role && member.expand) {
            throw new Error('expanding member with role currently not supported!')
        }

        if (member.role) {
            ast[member.role] = node
        }

        if (member.expand && !(node instanceof Array)) { // dictionary ast case
            const entries = Object.entries(node)
            entries.forEach(e => roles.includes(e[0] as Role) && (ast[e[0] as Role] = e[1]))
        }

    }

    return ast

}

function parseMemberRepeated(member: Member, cs: CharStream): AstNode | AstNode[] | string | undefined {
    // isNecessary has already been taken care of

    const list: AstNode[] = []
    let memento = cs.getPos()

    while (!cs.isEnd()) {

        memento = cs.getPos()
        const st = parseMemberSingle(member, cs)

        if (!st && !list.length) {
            return undefined
        }

        if (!st) {
            break
        }

        if (!isRepeatable(member.number)) {
            return st
        }

        list.push(st)

        if (member.sep) {
            parseMemberSingle({ types: [member.sep] }, cs)
        }

    }

    if (member.number === 'all-but-last') {
        list.pop()
        cs.backTo(memento)
    }

    return list
}

function parseMemberSingle(member: Member, cs: CharStream): AstNode | string | undefined {
    // doesn't have to take care about number

    if (member.literals) {
        return parseLiteral(member, cs)
    } else {
        return parseTry(member.types, cs)
    }
}

function parseLiteral(member: LiteralMember, cs: CharStream): AstNode | string | undefined {

    //TODO: anylexeme!

    if (member.anyCharExceptFor) {
        return parseChar(member, cs)
    }

    return first(member.literals, x => parseLiteralSingle(x, cs))

    // if (member.anyCharExceptFor) {
    //     return parseChar(member, cs)
    // }

    // const singleLetterLiterals = member.literals.filter(x => x.length <= 1)
    // const r1 = first(singleLetterLiterals, x => parseChar({ literals: [x], role: member.role }, cs))

    // if (r1) {
    //     return r1
    // }


    // const multiLetterLiterals: Syntax[] = member.literals
    //     .filter(x => x.length > 1)
    //     .map(x => x.split('').map(c => ({ literals: [c] })))


    // // OK TILL HERE
    // const r2 = first(multiLetterLiterals, x => parseSyntax(x, cs))

    // // if (member.literals.includes('not')) console.log('member=', member, 'multiLetterLiterals=', multiLetterLiterals, 'r2=', r2)

    // if (r2) {
    //     return r2
    // }

}

function parseLiteralSingle(literal: string, cs: CharStream) {

    const memento = cs.getPos()

    for (const x of literal) {

        if (x !== cs.peek()) {
            cs.backTo(memento)
            return undefined
        }

        cs.next()

    }

    return literal
}

function parseChar(leaf: Omit<LiteralMember, 'number'>, cs: CharStream): string | undefined {

    const char = cs.peek()

    if (leaf.literals.includes(char)
        || leaf.anyCharExceptFor && !leaf.anyCharExceptFor.includes(char)) {
        cs.next()
        return char
    }

}