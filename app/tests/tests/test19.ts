import { getBrain } from "../../src/facade/brain/Brain";

export function test19() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is a red button. if x is red then y is a green button');
    return brain.executeUnwrapped('green button')[0].style.background === 'green';
}
