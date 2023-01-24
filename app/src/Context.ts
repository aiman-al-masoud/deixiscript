import { Config, getConfig } from "./config/Config";
import getEnviro, { Enviro } from "./enviro/Enviro";

export interface Context {
    readonly enviro: Enviro
    readonly config: Config
}

export function getNewContext(): Context {
    return {
        enviro: getEnviro({ root: document.body }),
        config: getConfig()
    }
}