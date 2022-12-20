import { Clause, Id, Map } from "../clauses/Clause";
import Brain from "./Brain";

/**
 * The {@link Brain} should call {@link Sandbox.mapTo()} before asserting the content of a 
 * new {@link Clause}. This is to get a {@link Map}ping between entity {@link Id}s in 
 * sandbox and Brain, to resolve anaphora and avoid creating duplicate entities.
 */
export interface Sandbox {
    mapTo(universe: Brain): Map
}

export function getSandbox(clause: Clause) {
    return new BaseSandbox(clause)
}

class BaseSandbox implements Sandbox {

    constructor(readonly clause: Clause) {

        // create a prolog "sandbox"

        // write all contents of clause's THEME to the sandbox
        
    }

    mapTo(universe: Brain): Map {
        
        // get entities in sandbox

        // map entity in sanbox to its full description 

        // map full description to corresponding id in universe, if any

        // obtain iDInSandbox -> iDInUniversde map

        throw new Error("Method not implemented.");
    }

}