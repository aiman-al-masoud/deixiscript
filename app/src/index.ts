import main from "./main/main";
import autotester from "./tests/autotester";
import { toclausetests } from "./tests/toclausetests";

(async ()=>{
    await toclausetests()
    autotester()
})()

// main()