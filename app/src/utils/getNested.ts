import { wrap } from "../backend/wrapper/Wrapper"
import { getIncrementalId } from "../middle/id/functions/getIncrementalId"

export function getNested(object: any, path: string[]) {

    if (!object[path[0]]) {
        return undefined
    }

    let x = wrap({ object: object[path[0]], id: getIncrementalId(), parent: object, name: path[0] })

    path.slice(1).forEach(p => {
        const y = x.unwrap()[p]
        x = wrap({ object: y, id: getIncrementalId(), parent: x, name: p })
    })

    return x

}
