import { getBrain } from "../../src/facade/brain/Brain";

export function test14() {

    const brain = getBrain({ root: document.body });

    brain.executeUnwrapped('x and y and z are buttons. x and y are red and z is green.');

    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red'
        && brain.executeUnwrapped('y')[0].style.background === 'red'
        && brain.executeUnwrapped('z')[0].style.background === 'green';

    brain.executeUnwrapped('x and y and z are not red.');

    const assert2 = brain.executeUnwrapped('x')[0].style.background !== 'red'
        && brain.executeUnwrapped('y')[0].style.background !== 'red'
        && brain.executeUnwrapped('z')[0].style.background === 'green';

    return assert1 && assert2;

}
