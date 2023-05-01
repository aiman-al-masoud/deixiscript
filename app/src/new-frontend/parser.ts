import { CharStream } from "./char-stream";
import { Member, Role, Syntax } from "./cst-attempt2";

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
    throw new Error('capra!')
}


