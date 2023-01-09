import BasicBrain from "../brain/BasicBrain";
import { getBrain } from "../brain/Brain";

const tests = [test1, test2]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        console.log(await test() ? 'success' : 'fail', test.name)
        clearDom()
    }

}

async function test1() {
    const brain = await getBrain()
    await brain.execute('x is red. x is a button. y is a green button.');
    const assert1 = (await brain.execute('a green button'))[0].style.background === 'green'
    const assert2 = (await brain.execute('a red button'))[0].style.background === 'red'
    return assert1 && assert2
}

async function test2() {
    const brain = await getBrain()
    await brain.execute('x is red. x is a button. x is a button. x is a button. x is red.');
    const assert1 = (brain as BasicBrain).enviro.values.length === 1
    return assert1
}

function clearDom() {
    document.body.innerHTML = ''
    document.body.style.background = 'white'
}