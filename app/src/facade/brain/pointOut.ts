import Thing from "../../backend/wrapper/Thing"

export function pointOut(wrapper: Thing, opts?: { turnOff: boolean }) {

    const object = wrapper.unwrap()

    if (object instanceof HTMLElement) {
        object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
    }

}