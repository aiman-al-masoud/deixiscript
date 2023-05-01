// import main from "./src/main/main";
import { getCharStream } from "./src/new-frontend/char-stream";
import { tryParse } from "./src/new-frontend/parser";

// main()

// console.log(cstModelToAstModel(NOUN_PHRASE))

const cs = getCharStream('ciao ')
const x = tryParse(['identifier'], cs)
console.log(x)
