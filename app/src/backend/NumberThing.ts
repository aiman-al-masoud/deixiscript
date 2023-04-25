import { BaseThing } from "./BaseThing";

export class NumberThing extends BaseThing {

    constructor(readonly value: number) {
        super(value + '')
    }

    toJs(): number {
        return this.value
    }

}