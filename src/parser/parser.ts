import { first } from "../utils/first.ts";
import { uniq } from "../utils/uniq.ts";
import { getCharStream } from "./char-stream.ts";
import { maxPrecedence } from "./max-precedence.ts";
import { Syntax, isNecessary, Member, isRepeatable, LiteralMember, AstNode, SyntaxMap } from "./types.ts";



export function getParser(sourceCode: string, syntaxes: SyntaxMap) {
    return new KoolerParser(sourceCode, syntaxes)
}

class KoolerParser {

    protected syntaxList: string[]
    readonly keywords: string[]

    constructor(
        readonly sourceCode: string,
        readonly syntaxes: SyntaxMap,
        readonly cs = getCharStream(sourceCode),
    ) {
        this.syntaxList = Object.keys(this.syntaxes)
        this.syntaxList.sort((a, b) => maxPrecedence(a, b, syntaxes)) // WHAT ORDER??? ASCENDING OR DESCENDING??
        this.syntaxList = this.syntaxList.reverse() // ..........?????//
        this.keywords = uniq(Object.values(this.syntaxes).flatMap(x => x.flatMap(x => x.literals ?? []))) //.filter(x=>x.length > 1) //BAD
        console.log('syntaxList=', this.syntaxList)
        console.log('keywords=', this.keywords)
    }

    parse(): AstNode | undefined {
        return this.parseTry(this.syntaxList)
    }

    parseTry(syntaxList: string[], top = 0) {

        for (const syntaxName of syntaxList) {

            console.log(top, 'try parsing:', syntaxName)

            const memento = this.cs.getPos()
            const syntax = this.syntaxes[syntaxName]
            const ast = this.parseSyntax(syntax, syntaxName, top)

            // console.log('ast.type=', (ast as any)?.type)

            if (ast && ast instanceof Object && !(ast as any).type) {
                return { ...ast, type: syntaxName }
            }

            if (ast) {
                return ast
            }

            this.cs.backTo(memento)
        }

    }

    parseSyntax(syntax: Syntax, syntaxName: string, top = 0): AstNode | undefined {

        const ast: AstNode = {}

        for (const member of syntax) {

            const node = this.parseMemberMaybeRepeated(member, top)

            if (!node && isNecessary(member.number)) {
                console.log(top, syntaxName, 'failed because required', member.role ?? member.literals ?? member.types, 'is missing')
                return undefined
            }

            if (!node) { // and isNecessary=false
                console.log(top, syntaxName, 'unrequired', member.role ?? member.literals ?? member.types, 'not found, ignored', 'pos=', this.cs.getPos())
                continue
            }

            if (member.role && member.expand) {
                throw new Error('expanding member with role currently not supported!')
            }

            if (member.reduce) {
                return node
            }

            if (member.role) {
                ast[member.role] = node
            }

            if (member.expand && !(node instanceof Array)) { // dictionary ast case

                const entries = Object.entries(node)
                // entries.forEach(e => roles.includes(e[0]) && (ast[e[0]] = e[1]))

                entries.forEach(e => {

                    if (e[0] !== 'type') {
                        ast[e[0]] = e[1]
                    }

                })

                if (member.expand === 'keep-specific-type') {
                    ast['type'] = (node as { [x: string]: string })['type']
                    // console.log('keep type=', ast['type'])
                }

            }

            if (member.expand && (node instanceof Array)) {
                console.log('EXPAND ARRAY!', node, 'on', ast)
            }

        }

        return ast
    }

    parseMemberMaybeRepeated(member: Member, top = 0) {
        // isNecessary has already been taken care of

        if (isRepeatable(member.number)) {
            return this.parseMemberRepeated(member, top)
        } else {
            return this.parseMemberSingle(member, top)
        }
    }

    parseMemberRepeated(member: Member, top = 0): AstNode[] | string | undefined {

        const list: AstNode[] = []
        let memento = this.cs.getPos()

        while (!this.cs.isEnd()) {

            const mementoBuf = this.cs.getPos()
            const node = this.parseMemberSingle(member, top)

            if (!node) {
                break
            }

            if (node) {
                memento = mementoBuf
            }

            list.push(node)

            if (member.sep) {
                console.log(top, 'parseMemberRepeated before skipping a separator=', 'pos=', this.cs.getPos())
                this.parseMemberSingle({ types: [member.sep] }, top)
                console.log(top, 'parseMemberRepeated skipped a separator=', member.role ?? member.literals ?? member.types, 'pos=', this.cs.getPos())
            }

        }

        if (member.number === 'all-but-last') {
            console.log(top, 'have to backtrack, old list len=', list.length, 'pos=', this.cs.getPos())
            list.pop()
            this.cs.backTo(memento)
            console.log(top, 'backtrack, parseMemberRepeated pop from list of=', member.role ?? member.literals ?? member.types, 'new list len=', list.length, 'pos=', this.cs.getPos())
        }

        if (!list.length) {
            console.log(top, 'parseMemberRepeated empty list for=', member.role ?? member.literals ?? member.types, 'pos=', this.cs.getPos())
            return undefined
        }

        if (member.reduce) {
            console.log(top, 'parseMemberRepeated found ok list for=', member.role ?? member.literals ?? member.types, 'list=', list.toString(), 'pos=', this.cs.getPos())
            return list.map(x => x.toString()).reduce((a, b) => a + b)
        }

        return list
    }

    parseMemberSingle(member: Member, top = 0): AstNode | string | undefined {
        // doesn't have to take care about number

        if (member.literals) {
            return this.parseLiteral(member)
        } else {
            const result = this.parseTry(member.types, top + 1)

            if (this.keywords.includes(result as string) && result?.length! > 1) {
                console.log(top, 'returning undefined because a keyword is being trated as identifier! for=', member.role ?? member.literals ?? member.types, 'pos=', this.cs.getPos())
                return undefined
            }

            return result
        }

    }

    parseLiteral(member: LiteralMember): AstNode | string | undefined {
        const char = this.cs.peek()

        if (member.anyCharExceptFor && !member.anyCharExceptFor.includes(char)) {
            this.cs.next()
            return char
        }

        const result = first(member.literals, x => this.parseLiteralSingle(x, member.notEndWith))
        return result
    }

    parseLiteralSingle(literal: string, notEndWith?: string) {

        const memento = this.cs.getPos()

        for (const x of literal) {

            if (x !== this.cs.peek()) {
                this.cs.backTo(memento)
                return undefined
            }

            this.cs.next()
        }

        if (notEndWith && literal.length > 1 && literal.endsWith(notEndWith)) {
            this.cs.backTo(memento)
            return undefined
        }

        return literal
    }

}

