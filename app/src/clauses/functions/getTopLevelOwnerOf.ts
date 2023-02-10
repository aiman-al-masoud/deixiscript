import { Clause } from "../Clause"
import { Id } from "../../id/Id"
import { getTopLevel } from "./topLevel"

export function getTopLevelOwnerOf(id: Id, tl: Clause): Id | undefined {

    const owners = tl.ownersOf(id)

    const maybe = owners
        .filter(o => getTopLevel(tl).includes(o)).at(0)

    if (!maybe && owners.length > 0) {
        return getTopLevelOwnerOf(owners[0], tl)
    } else {
        return maybe
    }

}