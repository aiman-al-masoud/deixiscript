import Action from "./Action";
import { Clause } from "../../middle/clauses/Clause";
import { Context } from "../../facade/context/Context";
import { wrap } from "../wrapper/Wrapper";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import CreateLexemeAction from "./CreateLexemeAction";
import { Map } from "../../middle/id/Map";
import Imply from "../../middle/clauses/Imply";

export default class SimpleAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const maps = context.query(this.topLevel.theme)
        const maps2 = !maps.length ? this.getDefaultMap(this.clause, context) : maps
        const maps3 = this.clause instanceof Imply ? maps2 : maps2.slice(0, 1)


        maps3.forEach(m => {

            const argz = this.clause.args! ?? this.clause.entities
            const predicate = this.clause.predicate! ?? this.clause.rheme.predicate


            if (this.topLevel.flatList().some(x => x.predicate?.type === 'grammar')) {
                return new CreateLexemeAction(this.clause, this.topLevel).run(context)
            }

            const args = argz
                .map(id => m[id] ? context.get(m[id])! : context.set(wrap({ id: getIncrementalId() })))


            const subject = args[0]

            /* const res =  */subject?.set(predicate, {
                args: args.slice(1),
                context,
                negated: this.clause.negated
            })

            if (!predicate.referent && predicate.type === 'noun') { // referent of "proper noun" is first to get it 
                predicate.referent ??= subject
                context.setLexeme(predicate)
            }

            // return res//TODO save to context

        })

    }

    protected getDefaultMap(clause: Clause, context: Context): Map[] {

        if (clause instanceof Imply) {
            return []
        }
        if (this.topLevel.flatList().some(x => x.predicate?.type === 'grammar')) {
            return [{}]
        }

        return [(clause.args ?? [])
            .map(id => ({ [id]: context.set(wrap({ id: getIncrementalId() })).id }))
            .reduce((a, b) => ({ ...a, ...b }))]

    }

}