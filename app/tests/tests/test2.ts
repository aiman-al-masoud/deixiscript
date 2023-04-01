import BasicBrain from "../../src/facade/brain/BasicBrain";
import { getBrain } from "../../src/facade/brain/Brain";

export function test2() {
    const brain = getBrain({ root: document.body });
    const v1 = (brain as BasicBrain).context.values.length;
    brain.executeUnwrapped('x is red. x is a button. x is a button. x is a button. x is red.');
    const v2 = (brain as BasicBrain).context.values.length;
    return v2 - v1 === 1;
}
