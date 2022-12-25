import Prolog, { AssertOpts, PreidcatesOpts } from "./Prolog";
import pl from 'tau-prolog'
import { Map } from "../clauses/Clause";
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

    protected async performQuery(code: string): Promise<Map[] | boolean> {

        await (this.session as any).promiseQuery(code)
        let answers: Map[] = []

        for await (let ans of (this.session as any).promiseAnswers()) {

            const fmans = pl.format_answer(ans)

            if (['true', 'false'].includes(fmans)) {
                return fmans === 'true'
            }

            const links = ans.links

            const entry = Object.keys(links)
                .map(k => ({ [k]: links[k].value ?? links[k].id }))
                .reduce((a, b) => ({ ...a, ...b }))

            answers.push(entry)

        }

        if (this.queryHasVar(code)) {
            return answers
        } else {
            return false
        }

    }

    async query(code: string): Promise<Map[] | boolean> {

        try {
            return await this.performQuery(code)
        } catch (e) {
            console.warn(this.parseError(e))
            return false
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

    protected queryHasVar(code: string) { // check if query has a var. breaks down if predicate name contains capital letter!
        return code.split('').find(c => c.match(/\w+/) && c.toUpperCase() === c)
    }

    predicates(opts?: PreidcatesOpts): string[] {

        return Object.keys(this.session.rules)
            .map(r => r.split('/'))
            .filter(t => opts?.arity !== undefined ? parseInt(t[1]) === opts?.arity : true)
            .map(t => t[0])

    }


}