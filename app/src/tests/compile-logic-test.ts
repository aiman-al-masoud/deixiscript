import { getBrain } from "../brain/Brain"
import { Clause, clauseOf } from "../clauses/Clause"
import { getParser } from "../parser/Parser"


export default async function compileLogicTest() {

    async function test(string: string, checkClause: Clause) {
        const clause = getParser(string).parse().toClause()
        const brain = await getBrain()
        console.log('asserting', clause.toProlog())
        await brain.assert(clause)
        console.log('checking with', checkClause.toProlog())
        const queryResult = await brain.query(checkClause)
        console.log(queryResult)
    }

    test('the cat is on the mat',
         clauseOf('cat', 0)
        .concat(clauseOf('mat', 1))
        .concat(clauseOf('on', 0, 1)))


    // test('the cat that is red is on the mat')
    // test('the big cat that is on the mat is black')
    // test('every cat is red')
    // test('every red cat is on the mat')
    // test('the cat exists on the mat')
    // test('if the cat is on the mat then the cat is red')
    // test('the cat is not red')
    // test('every cat is not red')
    // test('trump is not a great president'); // probably need an and predicate

}