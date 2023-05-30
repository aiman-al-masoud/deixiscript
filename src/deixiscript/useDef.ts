import { WorldModel } from "../machines-like-us/types.ts";
import { ast_node } from "./deixi-ast.ts";

export function useDef(astNumber: number, ast: ast_node, wm: WorldModel): WorldModel {

    const wmCopy = wm.slice()
    const instructionId = 'instruction' + astNumber

    switch (ast.type) {
        case 'verb-sentence':
            wmCopy.push([instructionId, ast.subject.head, 'use'])
            if (ast.receiver) wmCopy.push([instructionId, ast.receiver.head, 'use'])
            if (ast.object) wmCopy.push([instructionId, ast.object.head, 'use'])
            break
        case 'there-is-sentence':
            wmCopy.push([instructionId, ast.subject.head, 'def'])
            break
        case 'copula-sentence':
            wmCopy.push([instructionId, ast.subject.head, 'def'])
            break

    }

    return wmCopy
}