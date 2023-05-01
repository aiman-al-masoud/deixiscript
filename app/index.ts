// import main from "./src/main/main";
import { getCharStream } from "./src/new-frontend/char-stream";
import { tryParse } from "./src/new-frontend/parser";

// main()

// console.log(cstModelToAstModel(NOUN_PHRASE))

// const x = tryParse(['identifier'], cs)

const cs = getCharStream('12    mondo ')
const x = tryParse(['number-literal'], cs)
// console.log(cs, cs.isEnd())
const y = tryParse(['space'], cs)
const z = tryParse(['identifier'], cs)
console.log(x, y, z)
