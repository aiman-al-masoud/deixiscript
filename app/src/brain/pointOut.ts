import Wrapper, { unwrap } from "../enviro/Wrapper";

export function pointOut(wrapper: Wrapper, opts?: { turnOff: boolean }) {

    const object = unwrap(wrapper)

    if (object instanceof HTMLElement) {
        object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
    }

}