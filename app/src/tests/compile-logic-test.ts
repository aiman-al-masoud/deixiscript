import { getBrain } from "../brain/Brain"
import { Clause, clauseOf } from "../clauses/Clause"
import { getParser } from "../parser/Parser"


export default async function compileLogicTest() {

    async function test(natlang: string, checkClause: Clause) {
        
        const brain = await getBrain()
        const sentences = natlang.split('.').filter(s=>s.trim())
        
        for (let s of sentences) {
            const clause = getParser(s).parse().toClause()
            await brain.assert(clause)
        }
        
        const queryResult = await brain.query(checkClause)
        console.log(natlang)
        console.log('checked with', checkClause.toProlog())
        console.log('result', !!queryResult)
    }

    await test('the cat is on the mat',
        clauseOf('cat', 0)
            .and(clauseOf('mat', 1))
            .and(clauseOf('on', 0, 1)))

    await test('the cat that is red is on the mat',
        clauseOf('cat', 33)
            .and(clauseOf('red', 33))
            .and(clauseOf('on', 33, 34)))

    await test('a cat is red. every cat is smart. a cat is black.',
        getParser('is the red cat smart').parse().toClause())

    // test('the big cat that is on the mat is black')
    // test('every cat is red')
    // test('every red cat is on the mat')
    // test('the cat exists on the mat')
    // test('if the cat is on the mat then the cat is red')
    // test('the cat is not red')
    // test('every cat is not red')
    // test('trump is not a great president'); // probably need an and predicate

}