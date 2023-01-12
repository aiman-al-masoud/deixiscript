import BasicBrain from "../brain/BasicBrain";
import { getBrain } from "../brain/Brain";

const tests = [test1, test2, test3, test4]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        console.log(await test() ? 'success' : 'fail', test.name)
        await wait(200)
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

async function test3() {
    const brain = await getBrain()
    await brain.execute('y is a button. x is red. y is a green button. x is a button. z is a black button.');
    const assert1 = (await brain.execute('a red button'))[0].style.background === 'red'
    const assert2 = (await brain.execute('a green button'))[0].style.background === 'green'
    const assert3 = (await brain.execute('a black button'))[0].style.background === 'black'
    return assert1 && assert2 && assert3
}

async function test4() {
    const brain = await getBrain()
    await brain.execute('a button is a button.');
    const button = await brain.execute('button')
    return button !== undefined
}

async function wait(millisecs: number) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs)
    })
}

function clearDom() {
    document.body.innerHTML = ''
    document.body.style.background = 'white'
}