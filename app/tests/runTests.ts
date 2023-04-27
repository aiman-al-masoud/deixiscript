import { test1 } from "./tests/test1";
import { test2 } from "./tests/test2";
import { test3 } from "./tests/test3";

const tests = [
    test1,
    test2,
    test3,
]

export async function runTests() {

    for (const test of tests) {
        const success = test()
        console.log(`%c${success ? 'success' : 'fail'} ${test.name}`, `color:${success ? 'green' : 'red'}`)
    }

}