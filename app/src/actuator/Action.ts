import { Clause } from "../clauses/Clause";
import { Ed } from "./Ed";

export default interface Action{
    run():Promise<void>
}

export function getAction(clause:Clause, er:Ed):Action{
    throw new Error('not implemented!')
}