import { BaseThing } from "./BaseThing";

export class NumberThing extends BaseThing {

    constructor(readonly value: number) {
        super(value + '')
    }

    toJs(): object {
        return this.value as any
    }

}