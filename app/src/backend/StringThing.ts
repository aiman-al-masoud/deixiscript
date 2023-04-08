import { BaseThing } from "./BaseThing"

export class StringThing extends BaseThing {

    constructor(readonly value: string) {
        super(value)
    }

    toJs(): object {
        return this.value as any //js sucks
    }

}