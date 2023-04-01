import { getBrain } from "../../src/facade/brain/Brain";

export function test23() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x and y and z are red. x and y and z are buttons');
    return brain.executeUnwrapped('red buttons').length === 3;
}
