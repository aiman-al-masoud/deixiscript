import { CharStream } from "./char-stream";
import { isNecessary, isRepeatable, LiteralMember, Member, Role, Syntax, TypeMember, syntaxes, AstType } from "./cst-attempt2";

//TODO any-symbol and exceptForLiterals
//TODO all-but-last

type SyntaxTree =
    string
    | string[]
    | SyntaxTree[]
    | { [x in Role]?: SyntaxTree }


export function tryParse(syntaxList: AstType[], cs: CharStream) {

    for (const syntaxName of syntaxList) {

        const memento = cs.getPos()
        const syntax = syntaxes[syntaxName] // state!
        const tree = knownParse(syntax, cs)

        if (tree) {
            return tree
        }

        cs.backTo(memento)
    }

}

function knownParse(syntax: Syntax, cs: CharStream): SyntaxTree | undefined {

    const st: SyntaxTree = {}

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
            st[member.role] = node
        }

    }

    return st

}

function parseMemberRepeated(member: Member, cs: CharStream): SyntaxTree | SyntaxTree[] | string | undefined {
    // isNecessary has already been taken care of

    const list: SyntaxTree[] = []

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
        // member.sep ??????
    }

    return list
}

function parseMemberSingle(member: Member, cs: CharStream): SyntaxTree | string | undefined {
    // doesn't have to take care about number

    if (member.literals) {
        return parseLiteral(member, cs)
    } else {
        return parseComposite(member, cs)
    }
}

function parseLiteral(member: LiteralMember, cs: CharStream): SyntaxTree | string | undefined {

    const singleLetterLiterals =
        member
            .literals
            .filter(x => x.length <= 1)

    for (const x of singleLetterLiterals) {
        const r = parseChar({ literals: [x] }, cs)
        if (r) {
            return r
        }
    }

    const multiLetterLiterals: Syntax[] = member
        .literals
        .filter(x => x.length > 1)
        .map(x => x.split('').map(c => ({ literals: [c] })))

    for (const x of multiLetterLiterals) {
        const r = knownParse(x, cs)
        if (r) {
            return r
        }
    }

}

function parseChar(leaf: Omit<LiteralMember, 'number'>, cs: CharStream): string | undefined {

    const char = cs.peek()

    if (leaf.literals.includes(char)) {
        cs.next()
        return char
    }

}

function parseComposite(composite: Omit<TypeMember, 'number'>, cs: CharStream): SyntaxTree | undefined {
    return tryParse(composite.types, cs)
}
