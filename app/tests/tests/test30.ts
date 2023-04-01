import { getBrain } from "../../src/facade/brain/Brain";

export function test30() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('=  is a copula');
    brain.executeUnwrapped('x = red button');
    return brain.executeUnwrapped('x')[0].style.background === 'red';
}
