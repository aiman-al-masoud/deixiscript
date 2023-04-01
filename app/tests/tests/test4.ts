import { getBrain } from "../../src/facade/brain/Brain";

export function test4() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('a button is a button.');
    const button = brain.executeUnwrapped('button');
    return button !== undefined;
}
