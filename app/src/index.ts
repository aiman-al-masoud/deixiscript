import main from "./main/main";
import autotester from "./tests/autotester"


(async () => {
    await autotester()
    main()
})()