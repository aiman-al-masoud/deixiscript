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


        // console.log(cs.isEnd())
        // console.log('tree=', tree)

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

        if (!node) { // and not necessary
            continue
        }

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
        // console.log( 'member=', member,  'isEnd=', cs.isEnd(), 'st=', st, 'list=', list )

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
        return parseLeaf(member, cs)
    } else {
        return parseComposite(member, cs)
    }

}

function parseLeaf(leaf: Omit<LiteralMember, 'number'>, cs: CharStream): string | undefined {

    const tok = cs.peekAcc()

    if (leaf.literals.includes(tok)) {
        cs.clearAcc()
        cs.next()
        return tok
    }

    // while (!cs.isEnd() && !leaf.literals.includes(cs.peekAcc())) {
    //     cs.next()
    //     // console.log('acc=', cs.peekAcc(), 'literals=', leaf.literals)
    // }

    // if (cs.isEnd() && !leaf.literals.includes(cs.peekAcc())) {
    //     return undefined
    // }

    // const result = cs.peekAcc()
    // // console.log('result=', result)
    // cs.clearAcc()
    // return result
}

function parseComposite(composite: Omit<TypeMember, 'number'>, cs: CharStream): SyntaxTree | undefined {
    return tryParse(composite.types, cs)
}
