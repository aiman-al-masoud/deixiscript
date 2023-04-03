import { test1 } from "./tests/test1"
import { test10 } from "./tests/test10"
import { test11 } from "./tests/test11"
import { test12 } from "./tests/test12"
import { test13 } from "./tests/test13"
import { test14 } from "./tests/test14"
import { test15 } from "./tests/test15"
import { test16 } from "./tests/test16"
import { test17 } from "./tests/test17"
import { test18 } from "./tests/test18"
import { test19 } from "./tests/test19"
import { test2 } from "./tests/test2"
import { test20 } from "./tests/test20"
import { test21 } from "./tests/test21"
import { test22 } from "./tests/test22"
import { test23 } from "./tests/test23"
import { test24 } from "./tests/test24"
import { test25 } from "./tests/test25"
import { test26 } from "./tests/test26"
import { test27 } from "./tests/test27"
import { test28 } from "./tests/test28"
import { test29 } from "./tests/test29"
import { test3 } from "./tests/test3"
import { test30 } from "./tests/test30"
import { test31 } from "./tests/test31"
import { test32 } from "./tests/test32"
import { test33 } from "./tests/test33"
import { test34 } from "./tests/test34"
import { test35 } from "./tests/test35"
import { test36 } from "./tests/test36"
import { test37 } from "./tests/test37"
import { test38 } from "./tests/test38"
import { test4 } from "./tests/test4"
import { test5 } from "./tests/test5"
import { test6 } from "./tests/test6"
import { test7 } from "./tests/test7"
import { test8 } from "./tests/test8"
import { test9 } from "./tests/test9"
import { clearDom } from "./utils/clearDom"
import { sleep } from "./utils/sleep"


const tests = [
    test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    test7,
    test8,
    test9,
    test10,
    test11,
    test12,
    test13,
    test14,
    test15,
    test16,
    test17,
    test18,
    test19,
    test20,
    test21,
    test22,
    test23,
    test24,
    test25,
    test26,
    test27,
    test28,
    test29,
    test30,
    test31,
    // test32,
    test33,
    test34,
    test35,
    test36,
    test37,
    test38,
]

/**
 * Integration tests
*/
export default async function autotester() {

    for (const test of tests) {
        const success = test()
        console.log(`%c${success ? 'success' : 'fail'} ${test.name}`, `color:${success ? 'green' : 'red'}`)
        await sleep(10)//75
        clearDom()
    }

}
