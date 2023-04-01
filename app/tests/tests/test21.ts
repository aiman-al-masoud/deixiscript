import { getBrain } from "../../src/facade/brain/Brain";

export function test21() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. color of every button is red.');
    return brain.executeUnwrapped('red buttons').length === 3;
}
