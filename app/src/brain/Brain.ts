import { Clause, Map } from "../clauses/Clause"
import PrologBrain from "./PrologBrain"

export default interface Brain{
    query(query:Clause): Promise<Map[] | boolean>
    assert(code:Clause):Promise<void>
    execute(natlang:string):Promise<Map[] | boolean>
    // clone():Brain
    // addListener(element:number, event:string, callback:(event:Event)=>void):void
}

export async function getBrain():Promise<Brain>{ // async due to possible init phase (in the future)
    return new PrologBrain()
}