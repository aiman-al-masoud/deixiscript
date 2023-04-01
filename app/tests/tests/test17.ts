import { getBrain } from "../../src/facade/brain/Brain";

export function test17() {
    const brain = getBrain({ root: document.body });

    brain.executeUnwrapped('x is a button');
    const x = brain.executeUnwrapped('x')[0];
    x.onclick = () => brain.executeUnwrapped('x is red');
    brain.executeUnwrapped('x clicks');
    return x.style.background === 'red';

}
