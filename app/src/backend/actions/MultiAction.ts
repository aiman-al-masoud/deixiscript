import { Context } from "../../facade/context/Context";
import { Clause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import Action from "./Action";
import { getAction } from "./getAction";

export default class MultiAction implements Action {

    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const maps = context.query(this.clause.theme).map(m => this.toMap(m))

        // console.log(this.clause.theme.toString())
        // console.log(this.clause.rheme.toString())
        // console.log('maps=', maps)

        maps.forEach(m => {

            const top = this.clause.copy({ map: m, exactIds: true })
            const conseq = top.rheme
            const clauses = conseq.flatList()
            const actions = clauses.map(c => getAction(c, top))
            actions.forEach(a => a.run(context))

        })

    }

    protected toMap(m: { [x: Id]: Wrapper }): Map {
        return Object.entries(m).map(e => ({ [e[0]]: e[1]?.id })).reduce((a, b) => ({ ...a, ...b }))
    }

}