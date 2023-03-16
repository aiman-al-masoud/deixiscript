import main from "./src/main/main";
import autotester from "./tests/autotester"
import { newUnification } from "./tests/newUnification";


(async () => {
    await autotester()
    main()
    // newUnification()
})()