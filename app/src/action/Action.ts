import Brain from "../brain/Brain"
import { BasicAction } from "./BasicAction"

export default interface Action {
    run(brain: Brain): Promise<any>
}

export function getAction(func: () => any) {
    return new BasicAction(func)
}