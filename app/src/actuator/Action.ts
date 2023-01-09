import { Enviro } from "../enviro/Enviro"

export default interface Action {
    run(enviro: Enviro): Promise<any>
}