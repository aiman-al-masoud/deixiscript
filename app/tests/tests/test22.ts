import { getBrain } from "../../src/facade/brain/Brain";

export function test22() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. background of style of every button is red.');
    return brain.executeUnwrapped('red buttons').length === 3;
}
