import { first } from "../utils/first";
import { CharStream } from "./char-stream";
import { isNecessary, isRepeatable, LiteralMember, Member, Role, Syntax, syntaxes, AstType } from "./csts";

//TODO all-but-last

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

        //TODO expand probably goes here

        if (member.role) {
            ast[member.role] = node
        }

    }

    return ast

}

function parseMemberRepeated(member: Member, cs: CharStream): AstNode | AstNode[] | string | undefined {
    // isNecessary has already been taken care of

    const list: AstNode[] = []

    while (!cs.isEnd()) {

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

    // member.number === 'all-but-last'

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

    if (member.anyCharExceptFor) {
        return parseChar(member, cs)
    }

    const singleLetterLiterals = member.literals.filter(x => x.length <= 1)
    const r1 = first(singleLetterLiterals, x => parseChar({ literals: [x] }, cs))

    if (r1) {
        return r1
    }

    const multiLetterLiterals: Syntax[] = member.literals
        .filter(x => x.length > 1)
        .map(x => x.split('').map(c => ({ literals: [c] })))

    const r2 = first(multiLetterLiterals, x => parseSyntax(x, cs))

    if (r2) {
        return r2
    }

}

function parseChar(leaf: Omit<LiteralMember, 'number'>, cs: CharStream): string | undefined {

    const char = cs.peek()

    if (leaf.literals.includes(char)
        || leaf.anyCharExceptFor && !leaf.anyCharExceptFor.includes(char)) {
        cs.next()
        return char
    }

}