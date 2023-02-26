import Wrapper from "../../backend/wrapper/Wrapper"

export function pointOut(wrapper: Wrapper, opts?: { turnOff: boolean }) {

    const object = wrapper.unwrap()

    if (object instanceof HTMLElement) {
        object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
    }

}