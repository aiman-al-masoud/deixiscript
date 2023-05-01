import main from "./src/main/main";
import { cstModelToAstModel } from "./src/new-frontend/cst-to-ast";
import { NOUN_PHRASE } from "./src/new-frontend/maybe-cst";


// main()

console.log(cstModelToAstModel(NOUN_PHRASE))