import Wrapper from "../enviro/Wrapper";

export function pointOut(wrapper: Wrapper, opts?: { turnOff: boolean }) {

    if (wrapper.object instanceof HTMLElement) {
        wrapper.object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
    }

}