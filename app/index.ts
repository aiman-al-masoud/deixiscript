// import main from "./src/main/main";
import { getCharStream } from "./src/new-frontend/char-stream";
import { tryParse } from "./src/new-frontend/parser";

// main()

// EXAMPLE 0 
// const cs = getCharStream('12    mondo ')
// const x = tryParse(['number-literal'], cs)
// const y = tryParse(['space'], cs)
// const z = tryParse(['identifier'], cs)
// console.log(x, y, z)

// EXAMPLE 1
// const cs = getCharStream('12    mondo ')
// const x = tryParse(['number-literal'], cs)
// EXAMPLE 2
// const cs = getCharStream('do not make ')// also try without not
// const x = tryParse(['do-verb'], cs)
// console.log(x)
// EXAMPLE 3
const cs = getCharStream('" ciao "xxx')
const x = tryParse(['string-literal'], cs)
console.log(x)


