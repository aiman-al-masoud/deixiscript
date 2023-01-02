import Brain, { getBrain } from "../brain/Brain";

const tests = [
    test1,
    test2,
    test3,
    test4,
    test5,
    test6
]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        console.log(await test())
        clearDom()
    }

}

async function test1() {
    const brain = await getBrain({ withActuator: true })
    await brain.execute('x is a red button.')
    const object = await getObject('x', brain)
    const assert1 = object.style.background === 'red'
    await brain.execute('is x a red button')
    await brain.execute('every clicked button is green.')
    object.click()
    await sleep(500)
    const assert2 = object.style.background === 'green'
    return assert1 && assert2
}

async function test2() {
    const brain = await getBrain({ withActuator: true })
    await brain.execute('x is a button. y is a button. z is a button.')
    const x = await getObject('x', brain)
    const y = await getObject('y', brain)
    const z = await getObject('z', brain)
    const assert1 = !(x.style.background && y.style.background && z.style.background)
    await brain.execute('every button is green.')
    await sleep(1000)
    const assert2 = [x.style.background, y.style.background, z.style.background].every(c => c === 'green')
    return assert1 && assert2
}

async function test3() {
    const brain = await getBrain({ withActuator: true })
    await brain.execute('x is a button. if the button is clicked then the button is red.')
    const x = await getObject('x', brain)
    const assert1 = !x.style.background
    x.click()
    await sleep(500)
    const assert2 = x.style.background === 'red'
    return assert1 && assert2
}

async function test4() {
    const brain = await getBrain({ withActuator: true })
    await brain.execute('a button is red')
    const x = await getObject('button', brain)
    return x.style.background === 'red'
}

async function test5() {
    const brain = await getBrain({ withActuator: true })
    await brain.execute('x is a button. background of style of x is blue ')
    const x = await getObject('button', brain)
    return x.style.background === 'blue'
}


async function test6() {
    const brain = await getBrain({ withActuator: true })
    await brain.execute('body is red')
    await sleep(100)
    return document.body.style.background === 'red'
}

async function getObject(description: string, brain: Brain) {
    const candidates = await brain.execute(description)
    const firstCandidate = candidates[0]
    const id = Object.entries(firstCandidate).filter(x => x[0] !== '_')[0][1]
    const wrapper = await brain.ed.get(id)
    return wrapper.object as HTMLElement
}


async function sleep(millisecs: number) {
    return new Promise((ok, err) => {
        setTimeout(() => {
            ok(true)
        }, millisecs)
    })
}

function clearDom() {
    document.body.innerHTML = ''
    // document.body.style.
}