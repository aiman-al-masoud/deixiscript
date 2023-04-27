import { AstNode } from "../../frontend/parser/interfaces/AstNode";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { BaseThing } from "./BaseThing";

export class InstructionThing extends BaseThing {

    constructor(readonly value: AstNode) {
        super(getIncrementalId())
    }

    toJs(): object {
        return this.value
    }

}