import main from "./main/main";
import autotester from "./tests/autotester"
import queryTester from "./tests/queryTester";


(async () => {
    await autotester()
    // queryTester()
    main()
})()



// 
