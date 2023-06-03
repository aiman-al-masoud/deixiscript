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
        case 'if-sentence':
            switch (ast.condition.type) {
                case 'copula-sentence':
                    wmCopy.push([instructionId, ast.condition.subject.head, 'use'])
                    wmCopy.push([instructionId, ast.condition.object.head, 'use'])
            }
            switch(ast.consequence.type){
                case 'copula-sentence':
                    wmCopy.push([instructionId, ast.consequence.subject.head, 'use'])
                    wmCopy.push([instructionId, ast.consequence.object.head, 'use'])
            }

    }

    return wmCopy
}