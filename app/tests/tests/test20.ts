import { getBrain } from "../../src/facade/brain/Brain";

export function test20() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is a red button. y is a green button if x is red');
    return brain.executeUnwrapped('green button')[0].style.background === 'green';
}
