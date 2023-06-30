import { first } from "../utils/first.ts";
import { parseNumber } from "../utils/parseNumber.ts";
import { uniq } from "../utils/uniq.ts";
import { CharStream, getCharStream } from "./char-stream.ts";
import { dependencies, maxPrecedence } from "./max-precedence.ts";
import { Syntax, isNecessary, Member, isRepeatable, LiteralMember, AstNode, SyntaxMap } from "./types.ts";

export function getParser(args: {
    syntaxes: SyntaxMap,
    log?: boolean,
}) {
    return new KoolerParser(
        args.syntaxes,
        !!args.log
    )
}

class KoolerParser {

    protected syntaxList: string[]
    readonly keywords: string[]
    protected cs: CharStream = getCharStream('')

    constructor(
        readonly syntaxes: SyntaxMap,
        readonly log: boolean,
    ) {
        this.syntaxList = getSyntaxList(this.syntaxes)
        this.keywords = getKeywords(this.syntaxes)
        maybeLog(this.log, 'syntaxList=', this.syntaxList)
        maybeLog(this.log, 'keywords=', this.keywords)
    }

    parse(sourceCode?: string): AstNode | undefined {

        if (sourceCode) {
            this.cs = getCharStream(sourceCode)
        }

        return this.parseTry(this.syntaxList)
    }

    parseTry(syntaxList: string[], top = 0) {

        for (const syntaxName of syntaxList) {

            maybeLog(this.log, top, 'try parsing:', syntaxName)

            const memento = this.cs.getPos()
            const syntax = this.syntaxes[syntaxName]
            const ast = this.parseSyntax(syntax, syntaxName, top)

            if (ast && typeof ast === 'object' && !('type' in ast)) {
                return { ...ast, type: syntaxName }
            }

            if (ast !== undefined) {
                return ast
            }

            this.cs.backTo(memento)
        }

    }

    parseSyntax(syntax: Syntax, syntaxName: string, top = 0): AstNode | undefined {

        const ast: AstNode = {}

        for (const member of syntax) {

            const node = this.parseMemberMaybeRepeated(member, top) ?? member.defaultsTo

            if (node === undefined && isNecessary(member.number)) {
                maybeLog(this.log, top, syntaxName, 'failed because required', member.role ?? member.literals ?? member.types, 'is missing')
                return undefined
            }

            if (node === undefined) { // and isNecessary=false
                maybeLog(this.log, top, syntaxName, 'unrequired', member.role ?? member.literals ?? member.types, 'not found, ignored', 'pos=', this.cs.getPos())
                continue
            }

            if (member.role && member.expand) {
                throw new Error('expanding member with role currently not supported!')
            }

            if (member.reduce && syntax.length <= 1) {
                return node
            }

            if (member.role) {
                ast[member.role] = node
            }

            if (member.expand && !(node instanceof Array)) { // dictionary ast case

                const entries = Object.entries(node)

                entries.forEach(e => {

                    if (e[0] !== 'type') {
                        ast[e[0]] = e[1]
                    }

                })

                if (member.expand === 'keep-specific-type') {
                    ast['type'] = (node as { [x: string]: string })['type']
                }

            }

            if (member.expand && (node instanceof Array)) {
                node.forEach(n => {
                    const entries = Object.entries(n).filter(e => e[0] !== 'type')
                    entries.forEach(e => {
                        ast[e[0]] = e[1]
                    })
                })
            }

        }

        return ast
    }

    parseMemberMaybeRepeated(member: Member, top = 0) {  // isNecessary has already been taken care of

        if (isRepeatable(member.number)) {
            return this.parseMemberRepeated(member, top)
        } else {
            return this.parseMemberSingle(member, top)
        }
    }

    parseMemberRepeated(member: Member, top = 0): AstNode[] | string | number | undefined {

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
                maybeLog(this.log, top, 'parseMemberRepeated before skipping a separator=', 'pos=', this.cs.getPos())
                this.parseMemberSingle({ types: [member.sep] }, top)
                maybeLog(this.log, top, 'parseMemberRepeated skipped a separator=', member.role ?? member.literals ?? member.types, 'pos=', this.cs.getPos())
            }

        }

        if (member.number === 'all-but-last') {
            maybeLog(this.log, top, 'have to backtrack, old list len=', list.length, 'pos=', this.cs.getPos())
            list.pop()
            this.cs.backTo(memento)
            maybeLog(this.log, top, 'backtrack, parseMemberRepeated pop from list of=', member.role ?? member.literals ?? member.types, 'new list len=', list.length, 'pos=', this.cs.getPos())
        }

        if (!list.length) {
            maybeLog(this.log, top, 'parseMemberRepeated empty list for=', member.role ?? member.literals ?? member.types, 'pos=', this.cs.getPos())
            return undefined
        }

        if (member.reduce) {
            maybeLog(this.log, top, 'parseMemberRepeated found ok list for=', member.role ?? member.literals ?? member.types, 'list=', list.toString(), 'pos=', this.cs.getPos())
            const string = list.map(x => x.toString()).reduce((a, b) => a + b)
            if (member.reduce === 'to-number') return parseNumber(string)
            return string
        }

        return list
    }

    parseMemberSingle(member: Member, top = 0): AstNode | string | undefined { // doesn't have to take care about number

        if (member.literals) {
            const result = this.parseLiteral(member)
            if (member.isBool && result !== undefined) return member.isBool === result ? true : false
            return result
        } else {
            const result = this.parseTry(member.types, top + 1)

            if (typeof result === 'string' && this.keywords.includes((result)) && result.length > 1) {
                maybeLog(this.log, top, 'returning undefined because a keyword is being trated as identifier! for=', member.role ?? member.literals ?? member.types, 'pos=', this.cs.getPos())
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

function maybeLog(log: boolean, ...message: unknown[]) {
    if (log) console.log(...message)
}

function getSyntaxList(syntaxes: SyntaxMap) {
    const syntaxList = Object.keys(syntaxes)
    const deps = Object.fromEntries(syntaxList.map(x => [x, dependencies(x, syntaxes)]))
    syntaxList.sort((a, b) => maxPrecedence(b, a, deps)) // descending, max precedence first
    return syntaxList
}

function getKeywords(syntaxes: SyntaxMap) {
    return uniq(Object.values(syntaxes).flatMap(x => x.flatMap(x => x.literals ?? []))) //.filter(x=>x.length > 1) //BAD
}