import { Config, getConfig } from "../config/Config";
import getEnviro, { Enviro, GetEnviroOps } from "../enviro/Enviro";

export interface Context {
    readonly enviro: Enviro
    readonly config: Config
}

export interface GetContextOpts extends GetEnviroOps { }

export function getNewContext(opts: GetContextOpts): Context {
    return {
        enviro: getEnviro(opts),
        config: getConfig()
    }
}