import { getBrain } from "../brain/Brain"

/**
 * Some cool fuzzy tests
 */
export default async function compileLogicTest() {

    async function test(statement: string, check: string) {
        const brain = await getBrain()
        await brain.execute(statement)
        console.log(await brain.execute(check))
    }

    await test('the cat is on the mat', 'is the cat on the mat')

    await test('the cat that is red is on the mat', 'is the red cat on the mat')

    await test('a cat is red. every cat is smart. a cat is black.', 'is the red cat smart')

    // await test('every cat is smart. x is a cat.', 'is x smart')

    await test('the dog is stupid', 'is the kettle on the stove') // false

    // test('the big cat that is on the mat is black')
    // test('every cat is red')
    // test('every red cat is on the mat')
    // test('the cat exists on the mat')
    // test('if the cat is on the mat then the cat is red')
    // test('the cat is not red')
    // test('every cat is not red')
    // test('trump is not a great president'); // probably need an and predicate

}