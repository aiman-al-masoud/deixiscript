import Prolog, { AssertOpts, PreidcatesOpts } from "./Prolog";
import pl, { Answer } from 'tau-prolog'
import { Id } from "../clauses/Clause";
require("tau-prolog/modules/promises.js")(pl);


export default class TauProlog implements Prolog {

    protected session: pl.type.Session

    constructor() {
        this.session = pl.create()
    }

    async assert(clause: string, opts?: AssertOpts): Promise<void> {
        await (this.session as any).promiseQuery(`assert${opts?.z ? 'z' : 'a'}( ( ${clause} ) ).`)
        return await (this.session as any).promiseAnswer()
    }

    async retract(clause: string): Promise<void> {
        await (this.session as any).promiseQuery(`retract(${clause}).`)
        return await (this.session as any).promiseAnswer()
    }

    async query(code: string): Promise<Id[] | boolean> {
        
        (this.session as any).promiseQuery(code);
        let answers: any[] = []

        for await (let ans of (this.session as any).promiseAnswers()) {
            
            const fmans = pl.format_answer(ans)
            
            if(['true', 'false'].includes(fmans)){
                return fmans==='true'
            }
            
            answers.push(ans.links.X.value??ans.links.X.id)
        }
        
        if( code.split('').find(c=> c.match(/\w+/) && c.toUpperCase()===c) ){ // query contains has var  // breaks down if predicate name contains capital letter!
            return answers
        }else{
            return false
        }
        
    }

    predicates(opts?: PreidcatesOpts): string[] {

        return Object.keys(this.session.rules)
            .map(r => r.split('/'))
            .filter(t => opts?.arity !== undefined ? parseInt(t[1]) === opts?.arity : true)
            .map(t => t[0])

    }


}