import { AstNode, AstType, Cardinality, Role, Member, AtomNode, CompositeNode } from "./ast-types";
import { ConstituentType, getBlueprint, isAtom, isNecessary } from "./blueprints";
import { getLexer } from "../../lexer/Lexer";
import { Parser } from "./Parser";
import { LexemeType } from "../../ast/interfaces/LexemeType";

export class KoolParser implements Parser {

    constructor(readonly sourceCode: string, readonly lexer = getLexer(sourceCode)) {
    }

    protected try(method: (args: any) => AstNode<AstType> | undefined, ...args: AstType[]) {

        const memento = this.lexer.pos;
        const x = method(args);

        if (!x) {
            this.lexer.backTo(memento);
        }

        return x;
    }

    parseAll() {

        const results: (AstNode<AstType> | undefined)[] = [];

        while (!this.lexer.isEnd) {
            results.push(this.parse());
            this.lexer.assert('fullstop', { errorOut: false });
        }

        return results;
    }

    parse() {

        return this.try(this.topParse, 'complexsentence1')
            ?? this.try(this.topParse, 'complexsentence2')
            ?? this.try(this.topParse, 'copulasentence')
            ?? this.try(this.topParse, 'iverbsentence')
            ?? this.try(this.topParse, 'mverbsentence')
            ?? this.try(this.topParse, 'nounphrase');
    }

    protected topParse = (name: AstType, number?: Cardinality, role?: Role): AstNode<AstType> | undefined => {

        const members = getBlueprint(name);

        if (members.length === 1 && members[0].type.every(t => isAtom(t))) {
            return this.parseAtom(members[0], number);
        } else {
            return this.parseComposite(name as ConstituentType, number, role);
        }

    };

    protected parseAtom = (m: Member, number?: Cardinality): AtomNode<LexemeType> | CompositeNode<ConstituentType> | undefined => {

        const atoms: AtomNode<LexemeType>[] = [];

        while (!this.lexer.isEnd && m.type.includes(this.lexer.peek.type)) {

            if (number !== '*' && atoms.length >= 1) {
                break;
            }

            const x = this.lexer.peek;
            this.lexer.next();
            atoms.push({ type: x.type, lexeme: x });
        }

        return number === '*' ? ({
            type: 'lexemelist',
            links: ({ list: atoms } as any) //TODO!!!!
        }) : atoms[0]

    }

    protected parseComposite = (name: ConstituentType, number?: Cardinality, role?: Role): CompositeNode<ConstituentType> | undefined => {

        const links: any = {}

        for (const m of getBlueprint(name)) {

            const ast = this.parseMember(m);

            if (!ast && isNecessary(m)) {
                return undefined;
            }

            if (ast) {
                links[m.role ?? ast.type] = ast
            }

        }

        return {
            type: name,
            role: role,
            links: links
        };
    };

    protected parseMember = (m: Member, role?: Role): AstNode<AstType> | undefined => {

        let x;

        for (const t of m.type) {

            x = this.topParse(t, m.number, m.role);

            if (x) {
                break;
            }

        }

        return x;
    };
}
