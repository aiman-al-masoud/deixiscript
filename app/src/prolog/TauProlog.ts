import Prolog, { AssertOpts } from "./Prolog";
import pl from 'tau-prolog'
import { Map } from "../clauses/Id";
import { PrologClause } from "../clauses/PrologClause";
require("tau-prolog/modules/promises.js")(pl);


export default class TauProlog implements Prolog {

    protected session: pl.type.Session

    constructor() {
        this.session = pl.create()
    }

    async assert(clause: PrologClause, opts?: AssertOpts): Promise<Map[]> {

        for (const c of clause.toList()) {

            const q = await this.query(c.copy({ anyFact: true }))

            if (q.length === 0) {
                const toBeAsserted = c.copy({ anyFact: false }).toString()
                await (this.session as any).promiseQuery(`assert${opts?.z ? 'z' : 'a'}( ( ${toBeAsserted} ) ).`)
                await (this.session as any).promiseAnswer()
                console.info('asserted', toBeAsserted)
            }
        }

        return []
    }

    async retract(clause: PrologClause): Promise<Map[]> {
        await (this.session as any).promiseQuery(`retract(${clause.toString()}).`)
        await (this.session as any).promiseAnswer()
        return []
    }

    async query(clause: PrologClause): Promise<Map[]> {

        try {
            const check = clause.toString() + '.'
            const q = await this.performQuery(check)
            console.info('checked', check)
            return q
        } catch (e) {
            console.warn(this.parseError(e))
            return [] //TODO: fix bug if error not finding anything although there could be something!
        }

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

    protected parseError(e: any) {

        const error = (e as any).args[0].args[0].id

        if (error == 'existence_error') {
            const missingPredicate = (e as any).args[0].args[0].args[1].args[0].id
            return { error, missingPredicate }
        } else {
            return e
        }

    }

}