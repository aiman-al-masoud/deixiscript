import { Context } from "../../Context"
import { Enviro } from "../../enviro/Enviro"

export default interface Action {
    run(context:Context): any
}