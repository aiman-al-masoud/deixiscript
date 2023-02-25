import { Map } from "../../id/Map";
import { Clause } from "../Clause";

export function mockMap(clause: Clause): Map {
    return clause.entities.map(e => ({ [e]: e })).reduce((a, b) => ({ ...a, ...b }))
}