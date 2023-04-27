import { Id } from "../middle/id/Id"
import { BaseThing } from "./BaseThing"
import { Thing } from "./Thing"

export class StringThing extends BaseThing {

    constructor(readonly value: string, id: Id = value) {
        super(id)
    }

    override toJs(): string {
        return this.value
    }

    clone(opts?: { id: string } | undefined): Thing { //TODO!
        return new StringThing(this.value, opts?.id)
    }

}