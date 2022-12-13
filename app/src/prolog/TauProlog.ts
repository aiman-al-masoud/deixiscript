import Prolog, { AssertOpts, PreidcatesOpts } from "./Prolog";
import pl from 'tau-prolog'
require("tau-prolog/modules/promises.js")(pl);


// TODO ALWAYS use PROMISE API!
export default class TauProlog implements Prolog {

    protected session: pl.type.Session

    constructor() {
        this.session = pl.create()
    }

    assert(clause: string, opts?: AssertOpts): void {
        // if (clause.includes(':-')){
            // this.session.consult(`${clause} .`)
            // this.session.answer(a => { })
        // }else{
            this.session.query(`assert${opts?.z ? 'z' : 'a'}( ( ${clause} ) ).`)
            this.session.answer(a => { console.log('LOG', clause, pl.format_answer(a)) })
        // }
    }

    retract(clause: string): void {
        this.session.query(`retract(${clause}).`)
        this.session.answer(a => { })
    }

    async query(code: string): Promise<any[]|boolean> {
        (this.session as any).promiseQuery(code);
        let answers:any[] = []
        
        for await (let answer of (this.session as any).promiseAnswers()){
            answers.push(answer.links.X.id)
        }

        return answers
    }

    predicates(opts?: PreidcatesOpts): string[] {

        return Object.keys(this.session.rules)
            .map(r => r.split('/'))
            .filter(t => opts?.arity !== undefined ? parseInt(t[1]) === opts?.arity : true)
            .map(t => t[0])

    }


}