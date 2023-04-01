import { getBrain } from "../../src/facade/brain/Brain";

export function test37() {
    const brain = getBrain({ root: document.body });
    brain.execute('x is red');
    brain.execute('x is a button');
    return brain.executeUnwrapped('x')[0].style.background === 'red';
}
