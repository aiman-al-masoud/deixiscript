import { Context } from "../../brain/Context"
import { Enviro } from "../../enviro/Enviro"

export default interface Action {
    run(context:Context): any
}