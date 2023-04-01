import BasicBrain from "../src/facade/brain/BasicBrain"
import { getBrain } from "../src/facade/brain/Brain"

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
    test24,
    test25,
    test26,
    test27,
    test28,
    test29,
    test30,
    test31,
    test32,
    test33,
    test34,
    test35,
    test36,
    test37,
]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        const success = test()
        console.log(`%c${success ? 'success' : 'fail'} ${test.name}`, `color:${success ? 'green' : 'red'}`)
        await sleep(10)//75
        clear()
    }

}

function test1() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is red. x is a button. y is a green button.');
    const assert1 = brain.executeUnwrapped('a green button')[0].style.background === 'green'
    const assert2 = brain.executeUnwrapped('a red button')[0].style.background === 'red'
    return assert1 && assert2
}

function test2() {
    const brain = getBrain({ root: document.body })
    const v1 = (brain as BasicBrain).context.values.length
    brain.executeUnwrapped('x is red. x is a button. x is a button. x is a button. x is red.');
    const v2 = (brain as BasicBrain).context.values.length
    return v2 - v1 === 1
}

function test3() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('y is a button. x is red. y is a green button. x is a button. z is a black button.');
    const assert1 = brain.executeUnwrapped('a red button')[0].style.background === 'red'
    const assert2 = brain.executeUnwrapped('a green button')[0].style.background === 'green'
    const assert3 = brain.executeUnwrapped('a black button')[0].style.background === 'black'
    return assert1 && assert2 && assert3
}

function test4() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('a button is a button.');
    const button = brain.executeUnwrapped('button')
    return button !== undefined
}

function test5() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a button. the color of x is red.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red'
    return assert1
}

function test6() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a button. the background of style of x is green.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'green'
    return assert1
}


function test7() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a button. y is a button. z is a button. every button is red.')
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red'
    const assert2 = brain.executeUnwrapped('y')[0].style.background === 'red'
    const assert3 = brain.executeUnwrapped('z')[0].style.background === 'red'
    return assert1 && assert2 && assert3
}

function test8() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a button. text of x is capra.')
    const assert1 = brain.executeUnwrapped('button')[0].textContent === 'capra'
    return assert1
}

function test9() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button. x is green.')
    const assert1 = brain.executeUnwrapped('red button').length === 0
    const assert2 = brain.executeUnwrapped('green button').length === 1
    return assert1 && assert2
}

function test10() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button. y is a green button. z is a blue button. the red button. it is black.')
    const assert1 = brain.executeUnwrapped('x').at(0).style.background == 'black'
    const assert2 = brain.executeUnwrapped('y').at(0).style.background == 'green'
    const assert3 = brain.executeUnwrapped('z').at(0).style.background == 'blue'
    return assert1 && assert2 && assert3
}

function test11() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z and w are buttons')
    brain.executeUnwrapped('x and y are red')
    brain.executeUnwrapped('w and z are black')

    const assert1 = brain.executeUnwrapped('x').at(0).style.background === brain.executeUnwrapped('y').at(0).style.background
    const assert2 = brain.executeUnwrapped('w').at(0).style.background === brain.executeUnwrapped('z').at(0).style.background
    const assert3 = brain.executeUnwrapped('x').at(0).style.background === 'red'
    const assert4 = brain.executeUnwrapped('w').at(0).style.background === 'black'
    return assert1 && assert2 && assert3 && assert4

}

function test12() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y are buttons')
    brain.executeUnwrapped('x appendChilds y')
    return Object.values(brain.executeUnwrapped('x')[0].children).includes(brain.executeUnwrapped('y')[0])
}

function test13() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a button and it is green')
    // brain.executeUnwrapped('x is a button and the button is green')
    return brain.executeUnwrapped('x')[0].style.background === 'green'
}

function test14() {

    const brain = getBrain({ root: document.body })

    brain.executeUnwrapped('x and y and z are buttons. x and y are red and z is green.')

    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red'
        && brain.executeUnwrapped('y')[0].style.background === 'red'
        && brain.executeUnwrapped('z')[0].style.background === 'green'

    brain.executeUnwrapped('x and y and z are not red.')

    const assert2 = brain.executeUnwrapped('x')[0].style.background !== 'red'
        && brain.executeUnwrapped('y')[0].style.background !== 'red'
        && brain.executeUnwrapped('z')[0].style.background === 'green'

    return assert1 && assert2

}

function test15() {

    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z are buttons. every button is blue.')
    brain.executeUnwrapped('z is red.')
    brain.executeUnwrapped('every button is not blue.')

    const assert1 = brain.executeUnwrapped('x')[0].style.background !== 'blue'
        && brain.executeUnwrapped('y')[0].style.background !== 'blue'
        && brain.executeUnwrapped('z')[0].style.background === 'red'

    return assert1
}

function test16() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a button')
    brain.executeUnwrapped('x is hidden')
    const assert1 = brain.executeUnwrapped('x')[0].hidden
    brain.executeUnwrapped('x is not hidden')
    const assert2 = !brain.executeUnwrapped('x')[0].hidden
    return assert1 && assert2
}

function test17() {
    const brain = getBrain({ root: document.body })

    brain.executeUnwrapped('x is a button')
    const x = brain.executeUnwrapped('x')[0]
    x.onclick = () => brain.executeUnwrapped('x is red')
    brain.executeUnwrapped('x clicks')
    return x.style.background === 'red'

}

function test18() {

    const brain = getBrain({ root: document.body })

    brain.executeUnwrapped('x and y are red. x is a button and y is a div.')
    brain.executeUnwrapped('every red button is black')
    const assert1 = brain.executeUnwrapped('button')[0].style.background === 'black'
    const assert2 = brain.executeUnwrapped('div')[0].style.background === 'red'
    return assert1 && assert2

}

function test19() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button. if x is red then y is a green button')
    return brain.executeUnwrapped('green button')[0].style.background === 'green'
}

function test20() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button. y is a green button if x is red')
    return brain.executeUnwrapped('green button')[0].style.background === 'green'
}

function test21() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z are buttons. color of every button is red.')
    return brain.executeUnwrapped('red buttons').length === 3
}

function test22() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z are buttons. background of style of every button is red.')
    return brain.executeUnwrapped('red buttons').length === 3
}

function test23() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z are red. x and y and z are buttons')
    return brain.executeUnwrapped('red buttons').length === 3
}

function test24() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y are red buttons')
    let clicks = ''
    brain.executeUnwrapped('x')[0].onclick = () => clicks += 'x'
    brain.executeUnwrapped('y')[0].onclick = () => clicks += 'y'
    brain.executeUnwrapped('every button clicks')
    return clicks === 'xy'
}

function test25() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y are buttons. x is red and y is blue')
    brain.executeUnwrapped('the button that is blue is black')
    const assert1 = brain.executeUnwrapped('y')[0].style.background === 'black'
    const assert2 = brain.executeUnwrapped('x')[0].style.background === 'red'
    return assert1 && assert2
}

function test26() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z are buttons')
    brain.executeUnwrapped('buttons are red')
    return brain.executeUnwrapped('red buttons').length === 3
}

function test27() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y and z are buttons. x and y are red. z is blue.')
    brain.executeUnwrapped('red buttons are black')
    const assert1 = brain.executeUnwrapped('z')[0].style.background === 'blue'
    const assert2 = brain.executeUnwrapped('black buttons').length === 2
    return assert1 && assert2
}

function test28() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button')
    brain.executeUnwrapped('border of style of x is dotted-yellow')
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red'
    const assert2 = brain.executeUnwrapped('x')[0].style.border.includes('dotted yellow')
    return assert1 && assert2
}

function test29() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is 1 and y is 2')
    brain.executeUnwrapped('x adds y')
    return brain.executeUnwrapped('it')[0] === 3
}

function test30() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('=  is a copula')
    brain.executeUnwrapped('x = red button')
    return brain.executeUnwrapped('x')[0].style.background === 'red'
}

function test31() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x and y are buttons. x is green and y is red.')
    const res = brain.executeUnwrapped('color of the red button')
    return res.includes('red') && !res.includes('green')
}

function test32() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button. y is a button and the color of it is purple.')
    const res = brain.executeUnwrapped('purple button')
    return res.length === 1 && res[0].style.background === 'purple'
}

function test33() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red div and the width of style of it is 50vw')
    // brain.executeUnwrapped('x is a red div and the width of style of the div is 50vw')
    return brain.executeUnwrapped('red div')[0].style.width === '50vw'
}

function test34() {
    const brain = getBrain({ root: document.body })
    brain.executeUnwrapped('x is a red button')
    brain.executeUnwrapped('fg of any button is color of style of it')
    brain.executeUnwrapped('fg of x is yellow')
    return brain.executeUnwrapped('x')[0].style.color === 'yellow'
}

function test35() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is a button')
    return brain.execute('something button').length === 0
}

function test36() {
    const brain = getBrain({ root: document.body })
    brain.execute('a car is a thing')
    brain.execute('x and y are cars')
    brain.execute('overtake is an mverb')
    brain.execute('x overtakes y')

    const firstIntension = brain.execute('the car that overtakes y')[0]
    const secondIntension = brain.execute('x')[0]
    const falseSecondIntension = brain.execute('y')[0]

    return firstIntension === secondIntension
        && firstIntension !== falseSecondIntension
}

function test37() {
    const brain = getBrain({ root: document.body })
    brain.execute('x is red')
    brain.execute('x is a button')
    return brain.executeUnwrapped('x')[0].style.background === 'red'
}

function sleep(millisecs: number) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs)
    })
}

function clear() {
    const x = document.createElement('body')
    document.body = x
}