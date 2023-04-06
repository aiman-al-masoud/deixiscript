import { Id } from "../Id";

export function getIncrementalId(): Id {
    const newId = `id${idGenerator.next().value}`;
    return newId
}

const idGenerator = getIncrementalIdGenerator();

function* getIncrementalIdGenerator() {
    let x = 0;
    while (true) {
        x++;
        yield x;
    }
}
