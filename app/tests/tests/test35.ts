import { getBrain } from "../../src/facade/brain/Brain";

export function test35() {
    const brain = getBrain({ root: document.body });
    brain.execute('x is a button');
    return brain.execute('something button').length === 0;
}
