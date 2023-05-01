import { CharStream } from "./char-stream";
import { LiteralMember, Member, Role, Syntax, TypeMember } from "./cst-attempt2";

type St = { [x in Role]?: St }

export function parseKnown(cs: CharStream, syntax: Syntax) {

    const cst: St = {}

    for (const member of syntax) {

        const result = parseMember(cs, member)

        if (member.role) {
            cst[member.role] = result
        }

    }

    return cst

}

function parseMember(cs: CharStream, member: Member): St | undefined {

    if (member.literals) {
        return parseLiteral(cs, member)
    } else if (member.types) {
        return parseType(cs, member)
    }

    throw new Error('capra!')
}

function parseLiteral(cs: CharStream, member: LiteralMember): St | undefined {
    throw new Error('capra!')
    
}

function parseType(cs: CharStream, member: TypeMember): St | undefined {
    throw new Error('capra!')
}




