import Wrapper, { unwrap } from "../wrapper/Wrapper"

export function pointOut(wrapper: Wrapper, opts?: { turnOff: boolean }) {

    const object = unwrap(wrapper)

    if (object instanceof HTMLElement) {
        object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
    }

}