// import main from "./src/main/main";
import { getCharStream } from "./src/new-frontend/char-stream";
import { tryParse } from "./src/new-frontend/parser";

// main()

// console.log(cstModelToAstModel(NOUN_PHRASE))

const cs = getCharStream('12 ')
const x = tryParse(['number-literal'], cs)
console.log(x)
