import { Id } from "../middle/id/Id";
import { BaseThing } from "./BaseThing";
import { Thing } from "./Thing";

export class NumberThing extends BaseThing {

    constructor(readonly value: number, id: Id = value + '') {
        super(id)
    }

    toJs(): number {
        return this.value
    }

    clone(opts?: { id: string } | undefined): Thing { //TODO!
        return new NumberThing(this.value, opts?.id)
    }

}