import { Clause } from "./Clause"
import { Id } from "./Id"

export function getTopLevelOwnerOf(id: Id, topLevel: Clause): Id | undefined {

    const owners = topLevel.ownersOf(id)

    const maybe = owners
        .filter(o => topLevel.topLevel().includes(o)).at(0)

    if (!maybe && owners.length > 0) {
        return getTopLevelOwnerOf(owners[0], topLevel)
    } else {
        return maybe
    }

}