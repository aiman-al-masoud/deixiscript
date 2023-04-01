import { getBrain } from "../../src/facade/brain/Brain";

export function test11() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x and y and z and w are buttons');
    brain.executeUnwrapped('x and y are red');
    brain.executeUnwrapped('w and z are black');

    const assert1 = brain.executeUnwrapped('x').at(0).style.background === brain.executeUnwrapped('y').at(0).style.background;
    const assert2 = brain.executeUnwrapped('w').at(0).style.background === brain.executeUnwrapped('z').at(0).style.background;
    const assert3 = brain.executeUnwrapped('x').at(0).style.background === 'red';
    const assert4 = brain.executeUnwrapped('w').at(0).style.background === 'black';
    return assert1 && assert2 && assert3 && assert4;

}
