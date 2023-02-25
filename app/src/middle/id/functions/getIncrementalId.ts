import { toVar } from "./toVar";
import { Id } from "../Id";

export interface GetIncrementalIdOpts {
    asVar: boolean
}

export function getIncrementalId(opts?: GetIncrementalIdOpts): Id {
    const newId = `id${idGenerator.next().value}`;
    return opts?.asVar ? toVar(newId) : newId;
}

const idGenerator = getIncrementalIdGenerator();

function* getIncrementalIdGenerator() {
    let x = 0;
    while (true) {
        x++;
        yield x;
    }
}
