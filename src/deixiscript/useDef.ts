import { WorldModel } from "../machines-like-us/types.ts";
import { ast_node } from "./ast-types.ts";

export function useDef(asts: ast_node[], wm: WorldModel): WorldModel {

    let wmCopy = wm.slice()

    asts.forEach((ast, i) => {
        wmCopy = oneStep(i, ast, wmCopy)
    })

    return wmCopy
}

function oneStep(astNumber: number, ast: ast_node, wm: WorldModel): WorldModel {

    const wmCopy = wm.slice()
    const instructionId = 'instruction' + astNumber

    switch (ast.type) {
        case 'verb-sentence':
            wmCopy.push([instructionId, ast.subject.head, 'use'])
            if (ast.object) wmCopy.push([instructionId, ast.object.head, 'use'])
        

    }

    return wmCopy
}