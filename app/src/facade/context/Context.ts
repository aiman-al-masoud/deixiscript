import getEnviro, { Enviro, GetEnviroOps } from "../../backend/enviro/Enviro";
import { Config, getConfig } from "./Config";

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