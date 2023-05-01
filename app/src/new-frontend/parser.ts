import { CharStream } from "./char-stream";
import { isNecessary, isRepeatable, LiteralMember, Member, Role, Syntax, TypeMember, syntaxes, AstType } from "./cst-attempt2";

type SyntaxTree = { [x in Role]?: SyntaxTree | string }


function tryParse(syntaxList: AstType[], syntaxes: { [x in AstType]: Syntax }, cs: CharStream) {

    for (const syntaxName of syntaxList) {

        const memento = cs.getPos()
        const syntax = syntaxes[syntaxName]
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

        const node = parseMember(member, cs)

        if (isNecessary(member.number) && !node) {
            return undefined
        }

        if (member.role) {
            st[member.role] = node
        }

    }

    return st

}

function parseLeaf(leaf: Omit<LiteralMember, 'number'>, cs: CharStream): SyntaxTree | undefined {
    throw new Error('not implemented!')
}

function parseComposite(composite: Omit<TypeMember, 'number'>, cs: CharStream): SyntaxTree | undefined {
    throw new Error('not implemented!')
}

function parseMember(member: Member, cs: CharStream): SyntaxTree | undefined {
    // isNecessary has already been taken care of
    throw new Error('not implemented!')
}


