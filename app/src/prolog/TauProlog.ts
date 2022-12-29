import Prolog, { AssertOpts, PreidcatesOpts } from "./Prolog";
import pl from 'tau-prolog'
import { Map } from "../clauses/Id";
require("tau-prolog/modules/promises.js")(pl);


export default class TauProlog implements Prolog {

    protected session: pl.type.Session

    constructor() {
        this.session = pl.create()
    }

    async assert(clause: string, opts?: AssertOpts): Promise<Map[]> {
        await (this.session as any).promiseQuery(`assert${opts?.z ? 'z' : 'a'}( ( ${clause} ) ).`)
        await (this.session as any).promiseAnswer()
        return []
    }

    async retract(clause: string): Promise<Map[]> {
        await (this.session as any).promiseQuery(`retract(${clause}).`)
        await (this.session as any).promiseAnswer()
        return []
    }

    protected async performQuery(code: string): Promise<Map[]> {

        await (this.session as any).promiseQuery(code)
        let answers: Map[] = []

        for await (let ans of (this.session as any).promiseAnswers()) {

            const links = ans.links

            const entry = Object.keys(links)
                .map(k => ({ [k]: links[k].value ?? links[k].id }))
                .reduce((a, b) => ({ ...a, ...b }))

            answers.push(entry)
        }

        return answers
    }

    async query(code: string): Promise<Map[]> {

        try {
            return await this.performQuery(code)
        } catch (e) {
            console.warn(this.parseError(e))
            return [] //TODO: fix bug if error not finding anything although there could be something!
        }

    }

    protected parseError(e: any) {

        const error = (e as any).args[0].args[0].id

        if (error == 'existence_error') {
            const missingPredicate = (e as any).args[0].args[0].args[1].args[0].id
            return { error, missingPredicate }
        } else {
            return e
        }

    }

    predicates(opts?: PreidcatesOpts): string[] {

        return Object.keys(this.session.rules)
            .map(r => r.split('/'))
            .filter(t => opts?.arity !== undefined ? parseInt(t[1]) === opts?.arity : true)
            .map(t => t[0])

    }


}