import { Context } from "../../brain/Context"

export default interface Action {
    run(context: Context): any
}