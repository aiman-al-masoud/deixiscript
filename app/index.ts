import main from "./src/main/main";
import { cstModelToAstModel } from "./src/new-frontend/cst-to-ast";
import { nounPhrase } from "./src/new-frontend/maybe-cst";


// main()

console.log(cstModelToAstModel(nounPhrase))