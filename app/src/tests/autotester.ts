import BasicBrain from "../brain/BasicBrain";
import { getBrain } from "../brain/Brain";

const tests = [
    test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    test7,
    test8,
    test9,
]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        console.log(await test() ? 'success' : 'fail', test.name)
        await sleep(200)
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


async function test5() {
    const brain = await getBrain()
    await brain.execute('x is a button. the color of x is red.');
    const assert1 = (await brain.execute('x'))[0].style.background === 'red'
    return assert1
}

async function test6() {
    const brain = await getBrain()
    await brain.execute('x is a button. the background of style of x is green.');
    const assert1 = (await brain.execute('x'))[0].style.background === 'green'
    return assert1
}


async function test7() {
    const brain = await getBrain()
    await brain.execute('x is a button. y is a button. z is a button. every button is red.')
    const assert1 = (await brain.execute('x'))[0].style.background === 'red'
    const assert2 = (await brain.execute('y'))[0].style.background === 'red'
    const assert3 = (await brain.execute('z'))[0].style.background === 'red'
    return assert1 && assert2 && assert3
}

async function test8() {
    const brain = await getBrain()
    await brain.execute('x is a button. text of x is capra.')
    const assert1 = (await brain.execute('button'))[0].textContent === 'capra'
    return assert1
}

async function test9() {
    const brain = await getBrain()
    await brain.execute('x is a red button. x is green.')
    const assert1 = (await brain.execute('red')).length === 0
    const assert2 = (await brain.execute('green')).length === 1
    return assert1 && assert2
}


async function sleep(millisecs: number) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs)
    })
}

function clearDom() {
    document.body.innerHTML = ''
    document.body.style.background = 'white'
}