import { getBrain } from "../../src/facade/brain/Brain";

export function test36() {
    const brain = getBrain({ root: document.body });
    brain.execute('a car is a thing');
    brain.execute('x and y are cars');
    brain.execute('overtake is an mverb');
    brain.execute('x overtakes y');

    const firstIntension = brain.execute('the car that overtakes y')[0];
    const secondIntension = brain.execute('x')[0];
    const falseSecondIntension = brain.execute('y')[0];

    return firstIntension === secondIntension
        && firstIntension !== falseSecondIntension;
}
