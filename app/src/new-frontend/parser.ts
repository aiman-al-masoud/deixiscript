import { first } from "../utils/first";
import { uniq } from "../utils/uniq";
import { getCharStream } from "./char-stream";
import { isNecessary, isRepeatable, LiteralMember, Member, Role, Syntax, AstType, roles } from "./csts";
import { maxPrecedence } from "./max-precedence";

type AstNode =
    string
    | string[]
    | AstNode[]
    | { [x in Role]?: AstNode }


export interface Parser {
    parse(sourceCode: string): AstNode | undefined
}

export function getParser(sourceCode: string, syntaxes: { [x in AstType]: Syntax }) {
    return new KoolerParser(sourceCode, syntaxes)
}

class KoolerParser implements Parser {

    readonly syntaxList = Object.keys(this.syntaxes) as AstType[]
    readonly keywords = uniq(Object.values(this.syntaxes).flatMap(x => x.flatMap(x => x.literals ?? [])).filter(x => x.length > 1))

    constructor(
        readonly sourceCode: string,
        readonly syntaxes: { [x in AstType]: Syntax },
        readonly cs = getCharStream(sourceCode),
    ) {
        this.syntaxList.sort((a, b) => maxPrecedence(b, a, syntaxes))
    }

    parse(): AstNode | undefined {
        return this.parseTry(this.syntaxList, true)
    }

    parseTry(syntaxList: AstType[], top = false) {

        for (const syntaxName of syntaxList) {

            // if (top) console.log('TRY WITH', syntaxName)

            const memento = this.cs.getPos()
            const syntax = this.syntaxes[syntaxName] // state!
            const tree = this.parseSyntax(syntax, syntaxName)

            if (tree) {
                return tree //{ ...tree, type: syntaxName } as SyntaxTree // remove cast // TODO: add type
            }

            // if (top) console.log(syntaxName, 'failed!')

            this.cs.backTo(memento)
        }

    }

    parseSyntax(syntax: Syntax, syntaxName: AstType): AstNode | undefined {

        const ast: AstNode = {}

        for (const member of syntax) {

            const node = this.parseMemberRepeated(member)

            if (!node && isNecessary(member.number)) {
                // console.log(syntaxName, 'failed because', member, 'was not found!')
                return undefined
            }

            if (!node) { // and isNecessary=false
                continue
            }

            if (member.role && member.expand) {
                throw new Error('expanding member with role currently not supported!')
            }

            if (member.role && member.reduce && node instanceof Array) {
                ast[member.role] = node.map(x => x.toString()).reduce((a, b) => a + b)
                continue
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

    parseMemberRepeated(member: Member): AstNode | AstNode[] | string | undefined {
        // isNecessary has already been taken care of

        const list: AstNode[] = []
        let memento = this.cs.getPos()

        while (!this.cs.isEnd()) {

            memento = this.cs.getPos()
            const st = this.parseMemberSingle(member)

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
                this.parseMemberSingle({ types: [member.sep] })
            }

        }

        if (member.number === 'all-but-last' && (list.length > 1)) { // 
            list.pop()
            this.cs.backTo(memento)
        }

        const result = list.length ? list : undefined

        return result
    }

    parseMemberSingle(member: Member): AstNode | string | undefined {
        // doesn't have to take care about number

        if (member.literals) {
            return this.parseLiteral(member)
        } else {
            const result = this.parseTry(member.types)
            return result
        }

    }

    parseLiteral(member: LiteralMember): AstNode | string | undefined {
        const char = this.cs.peek()

        if (member.anyCharExceptFor && !member.anyCharExceptFor.includes(char)) {
            this.cs.next()
            return char
        }

        const result = first(member.literals, x => this.parseLiteralSingle(x))
        return result
    }

    parseLiteralSingle(literal: string) {

        const memento = this.cs.getPos()

        for (const x of literal) {

            if (x !== this.cs.peek()) {
                this.cs.backTo(memento)
                return undefined
            }

            this.cs.next()
        }

        return literal
    }

}

