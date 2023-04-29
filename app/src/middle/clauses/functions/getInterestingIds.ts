import { Id } from "../../id/Id"
import { Map } from "../../id/Map"
import { Clause } from "../Clause"
import { getOwnershipChain } from "./getOwnershipChain"

export function getInterestingIds(maps: Map[], clause: Clause): Id[] {

    // const getNumberOfDots = (id: Id) => id.split('.').length //-1
    // the ones with most dots, because 'color of style of button' 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if 'color of button AND button'
    // const ids = maps.flatMap(x => Object.values(x))
    // const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    // return ids.filter(x => getNumberOfDots(x) === maxLen)

    const oc = getOwnershipChain(clause)

    if (oc.length <= 1) {
        return maps.flatMap(x => Object.values(x)) //all
    }

    // TODO: problem not returning everything because of getOwnershipChain()
    return maps.flatMap(m => m[oc.at(-1)!]) // owned leaf

}
