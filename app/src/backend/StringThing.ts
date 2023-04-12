import { Id } from "../middle/id/Id"
import { BaseThing } from "./BaseThing"
import { Thing } from "./Thing"

export class StringThing extends BaseThing {

    constructor(readonly value: string, id: Id = value) {
        super(id)
    }

    toJs(): object {
        return this.value as any //js sucks
    }

    clone(opts?: { id: string } | undefined): Thing { //TODO!
        // const x = super.clone(opts)
        return new StringThing(this.value, opts?.id)
    }

}