import { getBrain } from "../brain/Brain";
import { toClause } from "../brain/toClause";
import { clauseOf } from "../clauses/Clause";
import { getConfig } from "../config/Config";
import { Lexeme } from "../lexer/Lexeme";
import { getParser } from "../parser/interfaces/Parser";

export default function queryTester() {

    const $ = (s: string): Lexeme => ({ root: s, type: 'noun' })

    // let kb = clauseOf($('cat'), 0)
    //     .and(clauseOf($('black'), 0), { asRheme: true })

    // kb = kb
    //     .and(kb.copy({ map: { 0: 1 } }))
    //     .and(clauseOf($('capra'), 200))

    // const query = clauseOf($('cat'), 'ID100')
    //     .and(clauseOf($('black'), 'ID100'), { asRheme: true })
    //     .and(clauseOf($('capra'), 600))


    let kb = clauseOf($('of'), 0, 1)
        .and(clauseOf($('of'), 2, 3))

    const query = clauseOf($('of'), 'OWNED', 'OWNER')

    console.log(kb.toString())
    console.log(query.toString())
    const res = kb.query(query)
    console.log(res)

}