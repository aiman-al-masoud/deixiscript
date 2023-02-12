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
    test14,
    test15,
    test16,
    test17,
    test18,
    test19,
    test20,
    test21,
    test22,
    test23,
]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        console.log(test() ? 'success' : 'fail', test.name)
        await sleep(10)//75
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

function test14() {

    const brain = getBrain({ root: document.body })

    brain.execute('x and y and z are buttons. x and y are red and z is green.')

    const assert1 = brain.execute('x')[0].style.background === 'red'
        && brain.execute('y')[0].style.background === 'red'
        && brain.execute('z')[0].style.background === 'green'

    brain.execute('x and y and z are not red.')

    const assert2 = brain.execute('x')[0].style.background !== 'red'
        && brain.execute('y')[0].style.background !== 'red'
        && brain.execute('z')[0].style.background === 'green'

    return assert1 && assert2

}

function test15() {

    const brain = getBrain({ root: document.body })
    brain.execute('x and y and z are buttons. every button is blue.')
    brain.execute('z is red.')
    brain.execute('every button is not blue.')

    const assert1 = brain.execute('x')[0].style.background !== 'blue'
        && brain.execute('y')[0].style.background !== 'blue'
        && brain.execute('z')[0].style.background === 'red'

    return assert1
}

function test16() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button')
    brain.execute('x is hidden')
    const assert1 = brain.execute('x')[0].hidden
    brain.execute('x is not hidden')
    const assert2 = !brain.execute('x')[0].hidden
    return assert1 && assert2
}

function test17() {
    const brain = getBrain({ root: document.body })

    brain.execute('x is a button')
    const x = brain.execute('x')[0]
    x.onclick = () => brain.execute('x is red')
    brain.execute('x clicks')
    return x.style.background === 'red'

}

function test18() {

    const brain = getBrain({ root: document.body })

    brain.execute('x and y are red. x is a button and y is a div.')
    brain.execute('every red button is black')
    const assert1 = brain.execute('button')[0].style.background === 'black'
    const assert2 = brain.execute('div')[0].style.background === 'red'
    return assert1 && assert2

}

function test19() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a red button. if x is red then y is a green button')
    return brain.execute('green button')[0].style.background === 'green'
}

function test20() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a red button. y is a green button if x is red')
    return brain.execute('green button')[0].style.background === 'green'
}

function test21() {
    const brain = getBrain({ root: document.body })
    brain.execute('x and y and z are buttons. color of every button is red.')
    return brain.execute('red buttons').length === 3
}

function test22() {
    const brain = getBrain({ root: document.body })
    brain.execute('x and y and z are buttons. background of style of every button is red.')
    return brain.execute('red buttons').length === 3
}

function test23() {
    const brain = getBrain({ root: document.body })
    brain.execute('x and y and z are red. every red is a button')
    return brain.execute('red buttons').length === 3
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