import { getBrain } from "../../src/facade/brain/Brain";

export function test26() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons');
    brain.executeUnwrapped('buttons are red');
    return brain.executeUnwrapped('red buttons').length === 3;
}
