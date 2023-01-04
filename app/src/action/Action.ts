import Brain from "../brain/Brain"
import { BasicAction } from "./BasicAction"

export default interface Action {
    run(): Promise<any> //brain?: Brain
}

export function getAction(func: () => any) {
    return new BasicAction(func)
}