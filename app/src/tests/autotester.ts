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
    test10,
    test11,
    test12,
    test13,
]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        console.log(test() ? 'success' : 'fail', test.name)
        await sleep(100)
        clearDom()
    }

}

function test1() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is red. x is a button. y is a green button.');
    const assert1 = brain.execute('a green button')[0].style.background === 'green'
    const assert2 = brain.execute('a red button')[0].style.background === 'red'
    return assert1 && assert2
}

function test2() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is red. x is a button. x is a button. x is a button. x is red.');
    const assert1 = (brain as BasicBrain).context.enviro.values.length === 1
    return assert1
}

function test3() {
    const brain = getBrain({ root: document.body })
    brain.execute('y is a button. x is red. y is a green button. x is a button. z is a black button.');
    const assert1 = brain.execute('a red button')[0].style.background === 'red'
    const assert2 = brain.execute('a green button')[0].style.background === 'green'
    const assert3 = brain.execute('a black button')[0].style.background === 'black'
    return assert1 && assert2 && assert3
}

function test4() {
    const brain = getBrain({ root: document.body })
    brain.execute('a button is a button.');
    const button = brain.execute('button')
    return button !== undefined
}

function test5() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button. the color of x is red.');
    const assert1 = brain.execute('x')[0].style.background === 'red'
    return assert1
}

function test6() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button. the background of style of x is green.');
    const assert1 = brain.execute('x')[0].style.background === 'green'
    return assert1
}


function test7() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button. y is a button. z is a button. every button is red.')
    const assert1 = brain.execute('x')[0].style.background === 'red'
    const assert2 = brain.execute('y')[0].style.background === 'red'
    const assert3 = brain.execute('z')[0].style.background === 'red'
    return assert1 && assert2 && assert3
}

function test8() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button. text of x is capra.')
    const assert1 = brain.execute('button')[0].textContent == 'capra'
    return assert1
}

function test9() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a red button. x is green.')
    const assert1 = brain.execute('red').length === 0
    const assert2 = brain.execute('green').length === 1
    return assert1 && assert2
}

function test10() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a red button. y is a green button. z is a blue button. the red button. it is black.')
    const assert1 = brain.execute('x').at(0).style.background == 'black'
    const assert2 = brain.execute('y').at(0).style.background == 'green'
    const assert3 = brain.execute('z').at(0).style.background == 'blue'
    return assert1 && assert2 && assert3
}

function test11() {
    const brain = getBrain({ root: document.body })
    brain.execute('x and y and z and w are buttons')
    brain.execute('x and y are red')
    brain.execute('w and z are black')

    const assert1 = brain.execute('x').at(0).style.background === brain.execute('y').at(0).style.background
    const assert2 = brain.execute('w').at(0).style.background === brain.execute('z').at(0).style.background
    const assert3 = brain.execute('x').at(0).style.background === 'red'
    const assert4 = brain.execute('w').at(0).style.background === 'black'
    return assert1 && assert2 && assert3 && assert4

}

function test12() {
    const brain = getBrain({ root: document.body })
    brain.execute('x and y are buttons')
    brain.execute('x appendChilds y')
    return Object.values(brain.execute('x')[0].children).includes(brain.execute('y')[0])
}

function test13() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button and it is green')
    return brain.execute('x')[0].style.background === 'green'
}

function sleep(millisecs: number) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs)
    })
}

function clearDom() {
    document.body.innerHTML = ''
    document.body.style.background = 'white'
}